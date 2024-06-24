const mongoose = require('mongoose')
const Schema = mongoose.Schema

const NotificationSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    title: { type: String, default: "" },
    body: { type: String, default: "" },
    dayOfWeek: { type: Number, min: 0, max: 6 }, // 0: Sunday, 6: Saturday
    time_start: { type: String }, // HH:mm:ss format for recurring
    time_end: { type: String },   // HH:mm:ss format for recurring
    date_created: Date,
    date_updated: Date
})

const Notification = mongoose.model('Notification', NotificationSchema, 'notifications')
exports.schema = Notification

exports.create = async function (data) {
    try {
        const existingNotis = await Notification.find({
            userId: data.userId,
            courseId: data.courseId,
            dayOfWeek: data.dayOfWeek,
            time_start: data.time_start,
            time_end: data.time_end
        });

        const newDate = new Date(data.now);
        const duplicate = existingNotis.some(noti => {
            const existingDate = new Date(noti.date_created);
            return existingDate.getDate() === newDate.getDate() && existingDate.getMonth() === newDate.getMonth();
        });

        if (duplicate) {
            return { message: 'Notification already exists for the same day and month.' };
        }

        const notiData = {
            userId: data.userId,
            courseId: data.courseId,
            title: data.title,
            body: data.body,
            dayOfWeek: data.dayOfWeek,
            time_start: data.time_start,
            time_end: data.time_end,
            date_created: data.now,
            date_updated: new Date()
        }
        const newNoti = new Notification(notiData);
        await newNoti.save();
        return newNoti;
    } catch (err) {
        return { error: err }
    }
}

exports.getByUserId = async function (userId) {
    try {
        const noti = await Notification.find({ userId: userId });

        if (!noti) {
            return null;
        }

        return noti;
    } catch (err) {
        console.error(err);
        return { error: err }
    }
};
