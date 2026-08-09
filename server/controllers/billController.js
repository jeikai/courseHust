const billModel = require('../models/Bill');
const paymentModel = require('../models/Payment');
const vnpay = require('../helper/vnpay');
const mongoose = require('mongoose');

function getClientIp(req) {
    const forwarded = req.headers['x-forwarded-for'];
    const ip =
        (forwarded && forwarded.split(',')[0].trim()) ||
        req.connection?.remoteAddress ||
        req.socket?.remoteAddress ||
        '127.0.0.1';
    // VNPAY expects a plain IPv4-looking value; normalize the IPv6 loopback
    // that Node reports for local requests.
    return ip === '::1' ? '127.0.0.1' : ip.replace('::ffff:', '');
}

exports.vn_pay = async function (req, res) {
    try {
        // userId comes from the verified access token (see authMiddleware),
        // never from the request body - otherwise any caller could generate
        // a payment URL (and eventually a paid order) for someone else's cart.
        const userId = req.body.userId;
        const bankCode = req.body.bankCode;

        const enrollments = await require('../models/Enrollment').getById(userId);
        if (!enrollments.length) {
            return res.status(400).json({ message: 'Giỏ hàng trống' });
        }
        const amount = await billModel.getTotalAmountByUserId({ userId });
        if (amount?.error) {
            return res.status(400).json({ message: amount.error });
        }
        const courseIds = enrollments.map((e) => e.courseId._id);

        // The payment's own ObjectId doubles as vnp_TxnRef: globally unique
        // with no extra bookkeeping, and trivially maps back to the record.
        const paymentId = new mongoose.Types.ObjectId();
        const txnRef = paymentId.toHexString();

        await paymentModel.create({
            _id: paymentId,
            userId,
            courseIds,
            amount,
            txnRef,
            bankCode,
        });

        const { tmnCode, secretKey, paymentUrl, returnUrl } = vnpay.getConfig();
        const now = new Date();
        const createDate = vnpay.formatVnpDate(now);
        const expireDate = vnpay.formatVnpDate(new Date(now.getTime() + 15 * 60 * 1000));

        let vnpParams = {
            vnp_Version: '2.1.0',
            vnp_Command: 'pay',
            vnp_TmnCode: tmnCode,
            vnp_Locale: 'vn',
            vnp_CurrCode: 'VND',
            vnp_TxnRef: txnRef,
            vnp_OrderInfo: 'Thanh toan cho ma GD:' + txnRef,
            vnp_OrderType: 'other',
            vnp_Amount: vnpay.toVnpAmount(amount),
            vnp_ReturnUrl: returnUrl,
            vnp_IpAddr: getClientIp(req),
            vnp_CreateDate: createDate,
            vnp_ExpireDate: expireDate,
            vnp_BankCode: bankCode || undefined,
        };

        const secureHash = vnpay.signParams(vnpParams, secretKey);
        vnpParams.vnp_SecureHash = secureHash;
        const fullUrl = paymentUrl + '?' + vnpay.buildQueryString(vnpParams);

        // Sanitized debug snapshot - never logs the secret key or the raw hash.
        console.log('[vnpay] payment URL generated:', {
            environment: paymentUrl.includes('sandbox') ? 'sandbox' : 'production',
            gatewayUrl: paymentUrl,
            tmnCodeMasked: vnpay.maskTmnCode(tmnCode),
            amount,
            txnRef,
            returnUrl,
            createDate,
            expireDate,
        });

        return res.status(200).json({ message: 'Create token successfully', data: fullUrl });
    } catch (error) {
        console.error('[vnpay] failed to create payment URL:', error);
        return res.status(500).json({ message: error.message });
    }
};

// Server-to-server notification from VNPAY. Must respond with VNPAY's exact
// RspCode/Message contract - VNPAY retries on anything it doesn't recognize.
exports.vnpayIpn = async function (req, res) {
    try {
        const result = await paymentModel.confirmFromVnpay(req.query);

        switch (result.code) {
            case 'INVALID_SIGNATURE':
                return res.status(200).json({ RspCode: '97', Message: 'Invalid signature' });
            case 'ORDER_NOT_FOUND':
                return res.status(200).json({ RspCode: '01', Message: 'Order not found' });
            case 'AMOUNT_MISMATCH':
                return res.status(200).json({ RspCode: '04', Message: 'Invalid amount' });
            case 'ALREADY_PROCESSED':
                return res.status(200).json({ RspCode: '02', Message: 'Order already confirmed' });
            case 'PAYMENT_FAILED':
            case 'SUCCESS':
                return res.status(200).json({ RspCode: '00', Message: 'Confirm Success' });
            default:
                return res.status(200).json({ RspCode: '99', Message: 'Unknown error' });
        }
    } catch (error) {
        console.error('[vnpay] IPN handling failed:', error);
        return res.status(200).json({ RspCode: '99', Message: 'Unknown error' });
    }
};

// Browser-facing return URL. This is a convenience/UX path only (VNPAY does
// not guarantee the customer's browser ever reaches it - they might close
// the tab). It performs the same signature-verified, idempotent confirmation
// as the IPN so local/dev setups without a public IPN URL still work, then
// redirects to a plain frontend result page with no VNPAY params attached -
// the frontend never has to evaluate vnp_* values itself.
exports.vnpayReturn = async function (req, res) {
    const frontendBase = (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',')[0];
    try {
        const result = await paymentModel.confirmFromVnpay(req.query);
        const txnRef = req.query.vnp_TxnRef || '';

        if (!result.ok) {
            return res.redirect(
                `${frontendBase}/payment/result?status=error&reason=${encodeURIComponent(result.code)}`
            );
        }
        if (result.code === 'PAYMENT_FAILED') {
            return res.redirect(
                `${frontendBase}/payment/result?status=failed&txnRef=${encodeURIComponent(txnRef)}`
            );
        }
        return res.redirect(
            `${frontendBase}/payment/result?status=success&txnRef=${encodeURIComponent(txnRef)}`
        );
    } catch (error) {
        console.error('[vnpay] return handling failed:', error);
        return res.redirect(`${frontendBase}/payment/result?status=error&reason=server_error`);
    }
};

// Polled by the frontend result page / cart page instead of the old
// localStorage "storage" event hack, which any script on the page (or a
// second tab) could trigger to fake a successful payment.
exports.getPaymentStatus = async function (req, res) {
    try {
        const { txnRef } = req.params;
        const payment = await paymentModel.findByTxnRef(txnRef);
        if (!payment) return res.status(404).json({ message: 'Payment not found' });
        if (payment.userId.toString() !== req.body.userId?.toString()) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        return res.status(200).json({
            status: payment.status,
            amount: payment.amount,
            txnRef: payment.txnRef,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Free-cart checkout (every course priced at 0) - skips VNPAY entirely, but
// still verifies server-side that the cart is actually free rather than
// trusting a client-supplied "total" (the old public POST /api/bill let any
// caller grant an arbitrary user's paid cart for free with no check at all).
exports.freeCheckout = async function (req, res) {
    try {
        const userId = req.body.userId;
        const rawTotal = await billModel.getRawCourseTotal(userId);
        if (rawTotal?.error) {
            return res.status(400).json({ message: rawTotal.error });
        }
        if (rawTotal !== 0) {
            return res.status(400).json({ message: 'Cart is not free; payment is required' });
        }

        const newBill = await billModel.create({ userId, methodPayment: 'FREE' });
        if (newBill.hasOwnProperty('error')) {
            return res.status(500).json({ message: newBill.error });
        }

        return res.status(200).json({ message: 'Pay successfully', data: newBill });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.getById = async function (req, res) {
    try {
        const userId = req.params.userId;
        const result = await billModel.getById(userId);
        if (result.error) return res.status(400).json({ message: 'Failed to find' });
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.get = async function (req, res) {
    try {
        const result = await billModel.get();
        if (result.error) return res.status(400).json({ message: 'Failed to find' });
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.getByUserIdAndCourseId = async function (req, res) {
    try {
        const userId = req.params.userId;
        const courseId = req.params.courseId;

        const result = await billModel.getByUserIdAndCourseId(userId, courseId);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.getByCourseId = async function (req, res) {
    try {
        const courseId = req.params.courseId;
        const bills = await billModel.getByCourseId(courseId);

        if (bills.error) {
            return res.status(500).json({ message: bills.error });
        }

        return res.status(200).json(bills);
    } catch (error) {
        console.error('Error in getByCourseId controller:', error);
        return res.status(500).json({ message: error.message });
    }
};

exports.getStatistic = async function (req, res) {
    try {
        const bills = await billModel.getCourseStatistics();

        if (bills.error) {
            return res.status(500).json({ message: bills.error });
        }

        return res.status(200).json(bills);
    } catch (error) {
        console.error('Error in getByCourseId controller:', error);
        return res.status(500).json({ message: error.message });
    }
};
