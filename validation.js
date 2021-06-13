//Validation
const Joi = require('@hapi/joi');

//Register validation
const userregistervalidation = (data) => {
    const schema = {
        firstName: Joi.string().required().min(2),
        lastName: Joi.string().required().min(2),
        email: Joi.string().required().min(6).email(),
        mobileno: Joi.string().required().min(10),
        password: Joi.string().required().min(8),
        userType: Joi.string().required()
    };
    return Joi.validate(data, schema);
};

//Login validation
const loginvalidation = (data) => {
    const schema = {
        email: Joi.string().required().min(6).email(),
        password: Joi.string().required().min(8)
    };
    return Joi.validate(data, schema);
};



module.exports.userregistervalidation = userregistervalidation;
module.exports.loginvalidation = loginvalidation;