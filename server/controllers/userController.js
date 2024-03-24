const userModel = require('../models/User')
const tokenModel = require('../models/Token')
const utility = require('../helper/utility')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

exports.register = async function(req, res){
    try{
        const data = req.body
        utility.validate(data, ['email', 'password', 'name'])

        const checkEmail = await userModel.get(data)
        if(checkEmail) return res.status(400).json({message: 'Account existed! Please try with a different email'})

        const newUser = await userModel.create(data)
        if(newUser.error) return res.status(500).json({message: "Failed to register"})

        const { JWT_SECRET_ACCESS_TOKEN, JWT_EXPRIRE_ACCESS_TOKEN } = process.env
        const token = jwt.sign({ _id: newUser._id, email: newUser.email, password: newUser.password, role: newUser.role },
            JWT_SECRET_ACCESS_TOKEN,
            {expiresIn: JWT_EXPRIRE_ACCESS_TOKEN})
        await tokenModel.create(newUser._id, token)
        return res.status(200).json({
            message: 'Register successfully',
            account: newUser,
            authenticated: token
        })

    }catch(e){
        return res.status(500).json({message: e.message})
    }
}

exports.login = async function(req, res){
    try{
        const data = req.body
        utility.validate(data, ['email', 'password'])

        const checkUser = await userModel.get(data)
        if(!checkUser) return res.status(500).json({message: "Account not exist"})
        
        const checkPassword = await bcrypt.compare(data.password, checkUser.password)
        if(!checkPassword) return res.status(400).json({message: "Incorrect email or password"})

        const { JWT_SECRET_ACCESS_TOKEN, JWT_EXPRIRE_ACCESS_TOKEN } = process.env
        console.log(JWT_EXPRIRE_ACCESS_TOKEN);
        const token = jwt.sign({ _id: checkUser._id, email: checkUser.email, password: checkUser.password, role: checkUser.role },
            JWT_SECRET_ACCESS_TOKEN,
            {expiresIn: 86400})
        const checkToken = await tokenModel.get(checkUser._id)
        if(!checkToken) {
            await tokenModel.create(checkUser._id, token)
        }else{
            const data = {
                token: token,
                date_created: new Date()
            }
            await tokenModel.update(checkUser._id, data)
        }
        return res.status(200).json({
            message: 'Login successfully',
            account: checkUser,
            authenticated: token,
            permission: checkUser.role,
            verified: checkUser.is_verified
        })

    
    }catch(e){
        return res.status(500).json({message: e.message})
    }
}



exports.get = async function(req, res){
    try{
        const userId = req.params.userId
        const data = {id: userId}

        const result = await userModel.get(data)
        if(result.error) return res.status(500).json({message: "Failed to find"})
        return res.status(200).json(result)
    
    }catch(e){
        return res.status(500).json({message: e.message})
    }
}

exports.update = async function(req, res){
    try{
        const userId = req.params.userId
        const query = {id: userId}
        const checkUser = await userModel.get(query)
        if(!checkUser) return res.status(500).json({message: "Account not exist"})

        const data = req.body
        const result = await userModel.update(userId, data)
        if(result.error) return res.status(500).json({message: "Failed to update"})
        return res.status(200).json(result)
    }catch(e){
        return res.status(500).json({message: e.message})
    }
}

exports.delete = async function(req, res){
    try{
        const userId = req.params.userId
        const result = await userModel.delete(userId)
        if(!result) return res.status(400).json({message: "Failed to delete"})
        return res.status(200).json(result)
    }catch(e){
        return res.status(500).json({message: e.message})
    }
}