const mongoose = require('mongoose')
const Schema = mongoose.Schema  

const EnrollmentSchema = new Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    courseId: {type: mongoose.Schema.Types.ObjectId, ref: 'Course'},
    isEnroll: {type: Boolean, require: true},
    date_started: Date,
    date_finished: Date
})

const Enrollment = mongoose.model('Enrollment', EnrollmentSchema, 'enrollments')
exports.schema = Enrollment 

exports.create = async function(data){
    try {
        
    } catch (error) {
        return { error: error }
    }
}