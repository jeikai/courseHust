const jwt = require('jsonwebtoken')
const userModel = require('../models/User')


exports.checkToken = async function(req, res, next){
    const {JWT_SECRET_ACCESS_TOKEN} = process.env;
    const token  = req.headers.authorization.split(' ')[1]
    if ( 
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            const decoded = jwt.verify(token, JWT_SECRET_ACCESS_TOKEN)
            const now = Math.floor(Date.now() / 1000)
            if (decoded.exp < now){
                return res.status(401).json({message: 'Token expired'})
            }
            const user = await userModel.get({id: decoded._id})
            req.body.userId  = user._id
            next()
        } catch (error) {
            return res.status(401).json({message: 'Not authorized, token failed'})
            // return res.status(403).json(error)
        }
    }

    if (!token) {
        return res.status(401).json({message:'Not authorized, no token'})
    }
}


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
            const now = Math.floor(Date.now() / 1000)
            if (decoded.exp < now + 60){
                return res.status(401).json({message: 'Token expired'})
            }
            const user = await userModel.get({id: decoded._id})
            if(user.role === 'student'){
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
            const now = Math.floor(Date.now() / 1000)
            if (decoded.exp < now + 60){
                return res.status(401).json({message: 'Token expired'})
            }
            const user = await userModel.get({id: decoded._id})
            if(user.role === 'teacher'){
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
            const now = Math.floor(Date.now() / 1000)
            if (decoded.exp < now + 60){
                return res.status(401).json({message: 'Token expired'})
            }
            const user = await userModel.get({id: decoded._id})
            if(user.role === 'admin'){
                req.body.adminId  = user._id
                next()
            }else{
                return res.status(404).json({message: 'You are not admin'})
            }
        } catch (error) {
            return res.status(401).json({message: 'Not authorized, token failed',
            error: error.message})
        }
    }

    if (!token) {
        return res.status(401).json({message:'Not authorized, no token'})
    }
}