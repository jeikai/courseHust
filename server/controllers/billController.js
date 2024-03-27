const billModel = require('../models/Bill')

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
