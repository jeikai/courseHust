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