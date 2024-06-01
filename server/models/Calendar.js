const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CalendarSchema = new Schema({
  //instructorId
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  urlMeet: { type: String, default: '' },
  time_start: Date,
  time_end: Date,
  date_created: Date,
  date_updated: Date
})

const Calendar = mongoose.model('Calendar', CalendarSchema, 'calendars')
exports.schema = Calendar

exports.create = async function (data) {
  try {
    const lessonData = {
      userId: data.userId,
      courseId: data.courseId,
      title: data.title,
      description: data.description,
      urlMeet: data.urlMeet,
      time_start: data.time_start,
      time_end: data.time_end,
      date_created: new Date(),
      date_updated: new Date()
    }
    const newLesson = Calendar(lessonData)
    await newLesson.save()
    return newLesson
  } catch (err) {
    return { error: err }
  }
}

exports.getByCourseId = async function (courseId) {
  try {
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      throw new Error('Invalid course ID');
    }

    const calendars = await Calendar.find({ courseId });

    if (calendars.length === 0) {
      return null;
    }

    return calendars;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

exports.update = async function (id, data) {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid calendar ID');
    }

    data.date_updated = new Date();

    const updatedCalendar = await Calendar.findOneAndUpdate(
      { _id: id },
      data,
      { new: true }
    );

    if (!updatedCalendar) {
      return null;
    }

    return updatedCalendar;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

exports.delete = async function (id) {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid calendar ID');
    }

    const deletedCalendar = await Calendar.findByIdAndDelete(id);
    return deletedCalendar;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
