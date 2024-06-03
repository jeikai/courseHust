const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FavoriteSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    date_created: Date
});

const Favorite = mongoose.model('Favorite', FavoriteSchema, 'favorites');
exports.schema = Favorite;

exports.createOrDelete = async function (data) {
    try {
        const existingFavorite = await Favorite.findOne({ userId: data.userId, courseId: data.courseId });

        if (existingFavorite) {
            // Nếu bản ghi tồn tại, xoá bản ghi đó
            await Favorite.deleteOne({ _id: existingFavorite._id });
            return { message: 'Favorite deleted' };
        } else {
            // Nếu không tồn tại bản ghi, tạo mới
            const newFavorite = new Favorite({
                userId: data.userId,
                courseId: data.courseId,
                date_created: new Date(),
            });
            await newFavorite.save();
            return newFavorite;
        }
    } catch (err) {
        console.log(err);
        return { error: err.toString() };
    }
};

exports.getByUserId = async function (userId) {
    try {
        const result = await Favorite.find({ userId }).populate('courseId');
        return result;
    } catch (err) {
        return { error: err };
    }
};

exports.getByUserIdAndCourseId = async function (userId, courseId) {
    try {
        const result = await Favorite.find({ userId: userId, courseId: courseId }).populate('courseId');
        return result;
    } catch (err) {
        return { error: err };
    }
}
