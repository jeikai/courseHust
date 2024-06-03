const favoriteModel = require('../models/Favorite')

exports.createOrDelete = async function (req, res) {
    try {
        const data = req.body

        const newFavorite = await favoriteModel.createOrDelete(data)
        if (newFavorite.hasOwnProperty('error')) return res.status(500).json({ message: newFavorite.error })

        return res.status(200).json({ message: "Add to your favorite successfully", data: newFavorite })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error.message })
    }
}

exports.getByUserId = async function (req, res) {
    try {
        const userId = req.params.userId
        const response = await favoriteModel.getByUserId(userId)

        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

exports.getByUserIdAndCourseId = async function (req, res) {
    try {
        const { userId, courseId } = req.params; 
        const response = await favoriteModel.getByUserIdAndCourseId(userId, courseId);  // Chỉnh lại tên model nếu cần

        const exists = response.length > 0; 
        return res.status(200).json({ exists });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
