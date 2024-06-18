const billModel = require('../models/Bill')
const moment = require('moment')
function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

exports.vn_pay = async function (req, res) {
    try {
        const data = req.body
        let date = new Date();
        let createDate = moment(date).format('YYYYMMDDHHmmss');
        let ipAddr = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;
        let tmnCode = process.env.VNPAY_TMNCODE;
        let secretKey = process.env.VNPAY_SECRETKEY;
        let vnpUrl = process.env.VNPAY_URL;
        let returnUrl = process.env.VNPAY_RETURNURL;
        let orderId = moment(date).format('DDHHmmss');
        let amount = await billModel.getTotalAmountByUserId(data)
        let bankCode = data.bankCode;
        let locale = 'vn'
        let currCode = 'VND'
        let vnp_Params = {};
        vnp_Params['vnp_Version'] = '2.1.0';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = tmnCode;
        vnp_Params['vnp_Locale'] = locale;
        vnp_Params['vnp_CurrCode'] = currCode;
        vnp_Params['vnp_TxnRef'] = orderId;
        vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
        vnp_Params['vnp_OrderType'] = 'other';
        vnp_Params['vnp_Amount'] = amount * 100;
        vnp_Params['vnp_ReturnUrl'] = returnUrl;
        vnp_Params['vnp_IpAddr'] = ipAddr;
        vnp_Params['vnp_CreateDate'] = createDate;
        vnp_Params['vnp_BankCode'] = bankCode;
        console.log(vnp_Params)
        vnp_Params = sortObject(vnp_Params);
        let querystring = require('qs');
        let signData = querystring.stringify(vnp_Params, { encode: false });
        let crypto = require("crypto");
        let hmac = crypto.createHmac("sha512", secretKey);
        let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");
        vnp_Params['vnp_SecureHash'] = signed;
        vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
        return res.status(200).json({ message: "Create token successfully", data: vnpUrl })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

exports.getVN_PAY = async function (req, res) {
    try {
        let vnp_Params = req.query;

        let secureHash = vnp_Params['vnp_SecureHash'];

        vnp_Params = sortObject(vnp_Params);
        let tmnCode = process.env.VNPAY_TMNCODE;
        let secretKey = process.env.VNPAY_SECRETKEY;

        let querystring = require('qs');
        let signData = querystring.stringify(vnp_Params, { encode: false });
        let crypto = require("crypto");
        let hmac = crypto.createHmac("sha512", secretKey);
        let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");
        console.log(secureHash, signed)
        if (secureHash === signed) {
            return res.status(200).json({ message: "success" })
        } else {
            return res.status(200).json({ message: "not done" })
        }
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

exports.create = async function (req, res) {
    try {
        const data = req.body
        const newBill = await billModel.create(data)
        if (newBill.hasOwnProperty('error')) return res.status(500).json({ message: newBill.error })

        return res.status(200).json({ message: "Pay successfully", data: newBill })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

exports.getById = async function (req, res) {
    try {
        const userId = req.params.userId
        const result = await billModel.getById(userId)
        if (result.error) return res.status(400).json({ message: "Failed to find" })
        return res.status(200).json(result)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

exports.get = async function (req, res) {
    try {
        const result = await billModel.get()
        if (result.error) return res.status(400).json({ message: "Failed to find" })
        return res.status(200).json(result)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

exports.getByUserIdAndCourseId = async function (req, res) {
    try {
        const userId = req.params.userId
        const courseId = req.params.courseId

        const result = await billModel.getByUserIdAndCourseId(userId, courseId)
        return res.status(200).json(result)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

exports.getByCourseId = async function (req, res) {
    try {
        const courseId = req.params.courseId;
        const bills = await billModel.getByCourseId(courseId);

        if (bills.error) {
            return res.status(500).json({ message: bills.error });
        }

        return res.status(200).json(bills);
    } catch (error) {
        console.error("Error in getByCourseId controller:", error);
        return res.status(500).json({ message: error.message });
    }
};
