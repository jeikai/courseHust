const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs');


const UserSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    avatar: {type: String},
    role: { type: Number, enum: [0, 1, 2], default: 0},//student: 0, teacher: 1, admin: 2
    status: {type: Boolean, require: true, default: false},
    date_created: Date,
    date_updated: Date
})
1
const User = mongoose.model('User', UserSchema, 'users')
exports.schema = User

exports.create = async function(data){
    try{
        const hashedPassword = await bcrypt.hash(data.password, 10)
        switch(data.role){
            case 'student': data.role = 0; break;
            case 'teacher': data.role = 1; break;
        }
        const userData = {
            email: data.email,
            password: hashedPassword,
            name: data.name,
            avatar: data.avatar || '',
            role: data.role,
            date_created: new Date(),
            date_updated: new Date()
        }
        const newUser = User(userData)
        await newUser.save()
        return newUser
    }catch(e){
        return {error: e}
    }
}

exports.get = async function(data){
    try{
        let query = {}
        if (data.id) query._id = data.id
        if (data.email) query.email = data.email
        const user = await User.findOne(query)
        return user
    }catch(e){
        return {error: e}
    }
}

exports.update = async function(userId, data){
    try{
        const result = await User.findByIdAndUpdate(userId, data)
        return result
    }catch(e){
        return {error: e}
    }
}

