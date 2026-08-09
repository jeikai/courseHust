const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Enrollment = require('./Enrollment');
const Process = require('./Process');
const Bill = require('./Bill');
const vnpay = require('../helper/vnpay');

// Tracks one VNPAY transaction attempt from "payment URL generated" through
// to a verified outcome. A course purchase is only granted once a payment
// here reaches SUCCESS via a signature-verified VNPAY confirmation (IPN or
// return callback) - never just because a payment URL was created.
const PaymentSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    courseIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    amount: { type: Number, required: true }, // VND, not the VNPAY x100 form
    txnRef: { type: String, required: true, unique: true },
    bankCode: { type: String },
    status: {
        type: String,
        enum: ['PENDING', 'SUCCESS', 'FAILED', 'CANCELLED'],
        default: 'PENDING',
    },
    vnpTransactionNo: { type: String },
    vnpResponseCode: { type: String },
    billId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bill' },
    date_created: Date,
    date_updated: Date,
});

const Payment = mongoose.model('Payment', PaymentSchema, 'payments');
exports.schema = Payment;

exports.create = async function ({ _id, userId, courseIds, amount, txnRef, bankCode }) {
    const payment = new Payment({
        ...(_id ? { _id } : {}),
        userId,
        courseIds,
        amount,
        txnRef,
        bankCode,
        status: 'PENDING',
        date_created: new Date(),
        date_updated: new Date(),
    });
    await payment.save();
    return payment;
};

exports.findByTxnRef = async function (txnRef) {
    return Payment.findOne({ txnRef });
};

// Grants the courses tied to a PENDING payment: deletes the matching cart
// (Enrollment) rows, creates Process (owned-course) rows, and writes the
// Bill record - mirroring the legacy Bill.create() logic, but only ever
// invoked after signature + amount + status have all been verified.
async function grantCourses(payment) {
    const billData = {
        userId: payment.userId,
        methodPayment: payment.bankCode || 'VNPAY',
        listOfCourse: payment.courseIds,
        price: payment.amount,
        date_created: new Date(),
        date_updated: new Date(),
    };
    const bill = new Bill.schema(billData);
    await bill.save();

    await Promise.all(
        payment.courseIds.map((courseId) =>
            Enrollment.delete(payment.userId, courseId)
        )
    );
    await Promise.all(
        payment.courseIds.map((courseId) =>
            Process.create({ userId: payment.userId, courseId })
        )
    );

    return bill;
}

// The single, idempotent confirmation path shared by both the IPN endpoint
// and the browser return-URL endpoint. Either one may arrive first (IPN
// cannot reach a localhost backend in dev, so the return URL is often the
// only signal available there); whichever arrives first performs the grant,
// the other becomes a no-op via the PENDING status check.
//
// Returns a result object the caller (IPN/return controller) uses to build
// the correct response, rather than throwing on "business" outcomes like a
// declined payment - those are expected, valid results, not exceptions.
exports.confirmFromVnpay = async function (vnpParams) {
    const secretKey = vnpay.getConfig().secretKey;

    if (!vnpay.verifySignature(vnpParams, secretKey)) {
        return { ok: false, code: 'INVALID_SIGNATURE', message: 'Invalid signature' };
    }

    const txnRef = vnpParams.vnp_TxnRef;
    const payment = await Payment.findOne({ txnRef });
    if (!payment) {
        return { ok: false, code: 'ORDER_NOT_FOUND', message: 'Order not found' };
    }

    const vnpAmount = vnpay.fromVnpAmount(vnpParams.vnp_Amount);
    if (vnpAmount !== payment.amount) {
        return { ok: false, code: 'AMOUNT_MISMATCH', message: 'Amount invalid', payment };
    }

    if (payment.status !== 'PENDING') {
        // Already processed by the other channel (IPN vs return URL race) -
        // this is a normal, expected duplicate-notification case, not an error.
        return { ok: true, code: 'ALREADY_PROCESSED', message: 'Order already confirmed', payment };
    }

    const isSuccess =
        vnpParams.vnp_ResponseCode === '00' && vnpParams.vnp_TransactionStatus === '00';

    // Atomically claim the PENDING payment before doing any side effects, so
    // a concurrent IPN + return-URL race can't both pass the status check
    // above and both try to grant the same courses.
    const claimed = await Payment.findOneAndUpdate(
        { _id: payment._id, status: 'PENDING' },
        {
            status: isSuccess ? 'SUCCESS' : 'FAILED',
            vnpTransactionNo: vnpParams.vnp_TransactionNo,
            vnpResponseCode: vnpParams.vnp_ResponseCode,
            date_updated: new Date(),
        },
        { new: true }
    );

    if (!claimed) {
        // Lost the race to the other channel between the read above and now.
        const latest = await Payment.findById(payment._id);
        return { ok: true, code: 'ALREADY_PROCESSED', message: 'Order already confirmed', payment: latest };
    }

    if (!isSuccess) {
        return { ok: true, code: 'PAYMENT_FAILED', message: 'Payment failed', payment: claimed };
    }

    const bill = await grantCourses(claimed);
    claimed.billId = bill._id;
    await claimed.save();

    return { ok: true, code: 'SUCCESS', message: 'Payment confirmed', payment: claimed };
};
