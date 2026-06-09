const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs');


const UserSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    phoneNumber: {type: String, default: ''},
    documentUrl: {type: String, default: ''},
    role: { type: String, enum: ['student', 'teacher', 'admin'], default: 'student'},
    is_verified: {type: Boolean, default: false},
    date_created: Date,
    date_updated: Date
}) 

const User = mongoose.model('User', UserSchema, 'users')
exports.schema = User

exports.create = async function (data) {
    try {
        console.log(data)
        const hashedPassword = await bcrypt.hash(data.password, 10)
        const userData = {
            email: data.email,
            password: hashedPassword,
            name: data.name,
            phoneNumber: data.phone || '',
            documentUrl: data.upload || '',
            role: data.role,
            date_created: new Date(),
            date_updated: new Date()
        }
        const newUser = User(userData)
        await newUser.save()
        return newUser
    } catch (e) {
        console.log(e)
        return { error: e }
    }
}

exports.get = async function (data) {
    try { 
        let query = {}
        if (data.id) query._id = data.id
        if (data.email) query.email = data.email
        const user = await User.findOne(query).lean()
        return user
    } catch (e) {
        return { error: e }
    }
}

exports.getAll = async function () {
    try { 
        const user = await User.findOne({})
        return user
    } catch (e) {
        return { error: e }
    }
}

exports.update = async function (userId, data) {
    try {
        const result = await User.findByIdAndUpdate(userId, data)
        return await User.findById(result._id)
    } catch (e) {
        return { error: e }
    }
}

exports.delete = async function (userId) {
    try {
        const result = await User.findByIdAndDelete(userId)
        return result
    } catch (e) {
        return { error: e }
    }
}

exports.getAll = async function () {
    try {
        const users = await User.find({});
        return users;
    } catch (e) {
        return { error: e };
    }
};
