const jwt = require('jsonwebtoken')
const userModel = require('../models/User')

exports.protectStudent = async function(req, res, next){
    const { JWT_SECRET_ACCESS_TOKEN} = process.env;
    let token
    if ( 
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1]
            const decoded = jwt.verify(token, JWT_SECRET_ACCESS_TOKEN)
            const user = await userModel.findById(decoded._id)
            if(user.role === 0){
                req.body.studentId  = user._id
                next()
            }else{
               return res.status(404).json({message: 'You are not student'})
            }
        } catch (error) {
            return res.status(401).json({message: 'Not authorized, token failed'})
        }
    }

    if (!token) {
        return res.status(401).json({message:'Not authorized, no token'})
    }
}

exports.protectTeacher = async function(req, res, next){
    const { JWT_SECRET_ACCESS_TOKEN} = process.env;
    let token
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1]
            const decoded = jwt.verify(token, JWT_SECRET_ACCESS_TOKEN)
            const user = await userModel.findById(decoded._id)
            if(user.role === 1){
                req.body.teacherId  = user._id
                next()
            }else{
                return res.status(404).json({message: 'You are not teacher'})
            }
        } catch (error) {
            return res.status(401).json({message: 'Not authorized, token failed'})
        }
    }

    if (!token) {
        return res.status(401).json({message:'Not authorized, no token'})
    }
}

exports.protectAdmin = async function(req, res, next){
    const { JWT_SECRET_ACCESS_TOKEN} = process.env;
    let token
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1]
            const decoded = jwt.verify(token, JWT_SECRET_ACCESS_TOKEN)
            const user = await userModel.findById(decoded._id)
            if(user.role === 2){
                req.body.adminId  = user._id
                next()
            }else{
                return res.status(404).json({message: 'You are not admin'})
            }
        } catch (error) {
            return res.status(401).json({message: 'Not authorized, token failed'})
        }
    }

    if (!token) {
        return res.status(401).json({message:'Not authorized, no token'})
    }
}