const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const processModel = require('./Process')
const CalendarSchema = new Schema({
  // instructorId
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  urlMeet: { type: String, default: '' },
  dayOfWeek: { type: Number, min: 0, max: 6 }, // 0: Sunday, 6: Saturday
  time_start: { type: String }, // HH:mm:ss format for recurring
  time_end: { type: String },   // HH:mm:ss format for recurring
  day_start: { type: Date },
  day_end: { type: Date },
  exceptions: [{ type: Date }],
  date_created: { type: Date, default: Date.now }, 
  date_updated: { type: Date, default: Date.now }
});
 
const Calendar = mongoose.model('Calendar', CalendarSchema, 'calendars');
exports.schema = Calendar;

exports.create = async function (data) {
  try {
    const lessonData = {
      userId: data.userId,
      courseId: data.courseId,
      title: data.title,
      description: data.description,
      urlMeet: data.urlMeet,
      dayOfWeek: data.dayOfWeek,
      time_start: data.time_start,
      time_end: data.time_end,
      day_start: data.day_start,
      day_end: data.day_end,
      exceptions: data.exceptions || [],
      date_created: new Date(),
      date_updated: new Date(),
    };

    const newLesson = new Calendar(lessonData);
    await newLesson.save();
    return newLesson;
  } catch (err) {
    return { error: err };
  }
};

exports.getByCourseId = async function (courseId) {
  try {
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      throw new Error('Invalid course ID');
    }

    const calendars = await Calendar.find({ courseId }).populate("courseId");

    if (calendars.length === 0) {
      return null;
    }

    return calendars; 
  } catch (err) {
    console.error(err);
    throw err;
  }
};

exports.getByUserId = async function (userId) {
  try {
    let result = []
    const process = await processModel.getByUserId(userId);
    for (const proc of process) {
      const resultCalendar = await Calendar.find({ courseId: proc?.courseId._id }).populate("courseId");
      resultCalendar.forEach(calendar => result.push(calendar));
    }
    return result;
  } catch (error) {
    return { error: error }; 
  }
}

exports.update = async function (id, data) {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid calendar ID');
    }

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

exports.addException = async function (id, date) {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid calendar ID');
    }

    const updatedCalendar = await Calendar.findOneAndUpdate(
      { _id: id },
      { $push: { exceptions: date }, date_updated: new Date() },
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

exports.removeException = async function (id, date) {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid calendar ID');
    }

    const updatedCalendar = await Calendar.findOneAndUpdate(
      { _id: id },
      { $pull: { exceptions: date }, date_updated: new Date() },
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
