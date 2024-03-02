const mongoose = require('mongoose')
const Schema = mongoose.Schema

const courseSchema = new Schema({
    instuctorId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    level: { type: String, enum: ['basic', 'intermediate', 'advanced', 'specialized'], default: 'basic'},
    language: { type: String, required: true },
    tags: [{ type: String, required: true }],
    price: { type: Number, required: true },
    thumbnail: { type: String, required: true },
    date_created: Date,
    date_updated: Date
})

const Course = mongoose.model('Course', courseSchema, 'courses')
exports.schema = Course

exports.create = async function(data){
    
}