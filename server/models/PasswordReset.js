const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// One active reset flow per user. A new code request always replaces any
// existing document (see exports.create), which is also how a previously
// issued code/token gets invalidated the moment a fresh one is generated.
const PasswordResetSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    codeHash: { type: String, required: true },
    codeExpires: { type: Date, required: true },
    attempts: { type: Number, default: 0 },
    resetTokenHash: { type: String, default: null },
    resetTokenExpires: { type: Date, default: null },
    // Safety-net TTL so abandoned reset flows are garbage-collected even if
    // a user never completes or retries them.
    date_created: { type: Date, default: Date.now, expires: 3600 },
});

const PasswordReset = mongoose.model('PasswordReset', PasswordResetSchema, 'password_resets');
exports.schema = PasswordReset;

// Replaces any existing in-flight reset for this user, invalidating whatever
// code/token was previously issued.
exports.create = async function (userId, { codeHash, codeExpires }) {
    await PasswordReset.deleteOne({ userId });
    return await PasswordReset.create({
        userId,
        codeHash,
        codeExpires,
        attempts: 0,
        resetTokenHash: null,
        resetTokenExpires: null,
        date_created: new Date(),
    });
};

exports.getByUserId = async function (userId) {
    return await PasswordReset.findOne({ userId });
};

exports.incrementAttempts = async function (userId) {
    return await PasswordReset.findOneAndUpdate(
        { userId },
        { $inc: { attempts: 1 } },
        { new: true }
    );
};

exports.markVerified = async function (userId, { resetTokenHash, resetTokenExpires }) {
    return await PasswordReset.findOneAndUpdate(
        { userId },
        { resetTokenHash, resetTokenExpires },
        { new: true }
    );
};

exports.deleteByUserId = async function (userId) {
    return await PasswordReset.deleteOne({ userId });
};
