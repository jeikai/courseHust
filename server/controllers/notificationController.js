const notificationModel = require('../models/Notification')

exports.create = async function (req, res) {
    try {
        const data = req.body

        const newNotification = await notificationModel.create(data)
        if (newNotification.hasOwnProperty('message')) return res.status(500).json({ message: newNotification.message })
        if (newNotification.hasOwnProperty('error')) return res.status(500).json({ message: newNotification.error })

        return res.status(200).json({ message: "Create noti successfully", data: newNotification })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error.message })
    }
}

exports.getByUserId = async function (req, res) {
    try {
        const userId = req.params.userId
        const response = await notificationModel.getByUserId(userId)

        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}