const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TokenSchema = new Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    token: {type: String, required: true},
    date_created: {type: Date, default: Date.now, expires: 86400}
})

const Token = mongoose.model('Token', TokenSchema, 'tokens')
exports.schema = Token

exports.create = async function(userId, token){
    try{
        const data = {
            userId: userId,
            token: token,
            date_created: new Date()
        }
        const newToken = Token(data)
        await newToken.save()
        return newToken
    }catch(e){
        return {error: e}
    }
}

exports.get = async function(userId){
    try{
        return await Token.findOne({userId: userId})
    }catch(e){
        return {error: e}
    }
}

exports.update = async function(userId, data){
    try{
        await Token.findOneAndUpdate({userId: userId}, data)
        return await Token.findOne({userId: userId})
    }catch(e){
        return {error: e}
    }
}

exports.delete = async function(userId){
    try{
        const result = await Token.findOneAndDelete({userId: userId})
        return result
    }catch(e){
        return {error: e}
    }
}

