const jwt = require('jsonwebtoken')
const userModel = require('../models/User')


exports.checkToken = async function(req, res, next){
    const {JWT_SECRET_ACCESS_TOKEN} = process.env;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        const token = req.headers.authorization.split(' ')[1]
        try {
            const decoded = jwt.verify(token, JWT_SECRET_ACCESS_TOKEN)
            const now = Math.floor(Date.now() / 1000)
            if (decoded.exp < now){
                return res.status(401).json({message: 'Token expired'})
            }
            const user = await userModel.get({id: decoded._id})
            if (!user) return res.status(401).json({message: 'Not authorized, user not found'})
            req.body.userId  = user._id
            return next()
        } catch (error) {
            return res.status(401).json({message: 'Not authorized, token failed'})
        }
    }

    return res.status(401).json({message:'Not authorized, no token'})
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
            if (!user) return res.status(401).json({message: 'Not authorized, user not found'})
            if(user.role === 'student'){
                req.body.studentId  = user._id
                next()
            }else{
               return res.status(403).json({message: 'You are not student'})
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
            if (!user) return res.status(401).json({message: 'Not authorized, user not found'})
            if(user.role === 'teacher'){
                req.body.teacherId  = user._id
                next()
            }else{
                return res.status(403).json({message: 'You are not teacher'})
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
            if (!user) return res.status(401).json({message: 'Not authorized, user not found'})
            if(user.role === 'admin'){
                req.body.adminId  = user._id
                next()
            }else{
                return res.status(403).json({message: 'You are not admin'})
            }
        } catch (error) {
            return res.status(401).json({message: 'Not authorized, token failed'})
        }
    }

    if (!token) {
        return res.status(401).json({message:'Not authorized, no token'})
    }
}

// Accepts any authenticated user regardless of role
exports.protectAny = async function(req, res, next) {
    const { JWT_SECRET_ACCESS_TOKEN } = process.env;
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, JWT_SECRET_ACCESS_TOKEN);
            const now = Math.floor(Date.now() / 1000);
            if (decoded.exp < now + 60) {
                return res.status(401).json({ message: 'Token expired' });
            }
            const user = await userModel.get({ id: decoded._id });
            if (!user) return res.status(401).json({ message: 'User not found' });
            req.body = req.body || {};
            req.body.userId = user._id;
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// Allows only the account owner (req.params.userId) or an admin to proceed.
// Prevents any authenticated user from editing another user's record (IDOR).
exports.protectSelfOrAdmin = async function(req, res, next){
    const { JWT_SECRET_ACCESS_TOKEN} = process.env;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        const token = req.headers.authorization.split(' ')[1]
        try {
            const decoded = jwt.verify(token, JWT_SECRET_ACCESS_TOKEN)
            const now = Math.floor(Date.now() / 1000)
            if (decoded.exp < now + 60){
                return res.status(401).json({message: 'Token expired'})
            }
            const user = await userModel.get({id: decoded._id})
            if (!user) return res.status(401).json({message: 'Not authorized, user not found'})
            if (user._id.toString() !== req.params.userId && user.role !== 'admin'){
                return res.status(403).json({message: 'You can only modify your own account'})
            }
            req.body.userId = user._id
            return next()
        } catch (error) {
            return res.status(401).json({message: 'Not authorized, token failed'})
        }
    }

    return res.status(401).json({message:'Not authorized, no token'})
}

exports.protectInstructor = async function(req, res, next){
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
            if (!user) return res.status(401).json({message: 'Not authorized, user not found'})
            if(user.role === 'admin' || user.role === 'teacher'){
                req.body.instructorId  = user._id
                next()
            }else{
                return res.status(403).json({message: 'You are not admin'})
            }
        } catch (error) {
            return res.status(401).json({message: 'Not authorized, token failed'})
        }
    }

    if (!token) {
        return res.status(401).json({message:'Not authorized, no token'})
    }
}