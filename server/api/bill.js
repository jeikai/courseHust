const api = require('express').Router()
const billController = require('../controllers/billController')
const authMiddleware = require('../middlewares/authMiddleware')
const use = require('../helper/utility').use

// Free-cart checkout ("total" is 0) - still requires auth; the server
// verifies the cart is actually free rather than trusting the client.
api.post('/bill/free-checkout', authMiddleware.protectAny, use(billController.freeCheckout))

// Generates a VNPAY payment URL for the caller's own cart. userId is taken
// from the verified token inside the controller, never from the body.
api.post('/vnpay', authMiddleware.protectAny, use(billController.vn_pay))

// VNPAY calls this server-to-server; it is not reachable through the user's
// session, so it is intentionally not behind our own JWT auth - the VNPAY
// signature on the payload is what authenticates the caller.
api.get('/vnpay/ipn', use(billController.vnpayIpn))

// VNPAY redirects the customer's browser here after payment.
api.get('/vnpay/return', use(billController.vnpayReturn))

api.get('/vnpay/status/:txnRef', authMiddleware.protectAny, use(billController.getPaymentStatus))

api.get('/bill/:userId', use(billController.getById))

api.get('/bill', use(billController.get))

api.get('/bill/check/:userId/:courseId', use(billController.getByUserIdAndCourseId))

api.get('/bill/course/:courseId', use(billController.getByCourseId))

api.get('/bill/get/statistic', use(billController.getStatistic))

module.exports = api
