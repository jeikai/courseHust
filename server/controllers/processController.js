const { message } = require('antd');
const processModel = require('../models/Process')

exports.getByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;
        const result = await processModel.getByUserId(userId);
        if(!result) {
            return res.status(400).json({message: "No course found"})
        }
        return res.status(200).json({data: result})
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}