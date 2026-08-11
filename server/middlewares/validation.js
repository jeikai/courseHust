const Joi = require('joi')

exports.registerValidate = (req, res, next) => {
    const data = req.body
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        name: Joi.string().required(),
        // role: Joi.string().required()
    })
    const { error } = schema.validate(data);
    if (error) return res.status(400).json({message: error.details[0].message});
    next();
}

exports.loginValidate = (req, res, next) => {
    const data = req.body
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    })
    const { error } = schema.validate(data);
    if (error) return res.status(400).json({message: error.details[0].message});
    next();
}

exports.forgotPasswordValidate = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
    })
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    next();
}

exports.verifyResetCodeValidate = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        code: Joi.string().length(6).pattern(/^[0-9]+$/).required()
            .messages({ 'string.pattern.base': 'Code must be 6 digits' }),
    })
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    next();
}

exports.resetPasswordValidate = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        resetToken: Joi.string().required(),
        newPassword: Joi.string().min(6).required(),
        confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required()
            .messages({ 'any.only': 'Passwords do not match' }),
    })
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    next();
}