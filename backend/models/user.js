const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: { type: String, default: null },
    lastName: { type: String, default: null },
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    password: { type: String },
    token: { type: String },
    isConfirmed: {type: Boolean, default: false}
});

const validate = (user) => {
    const schema = Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        username: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required()
    });
    return schema.validate(user);
};

const USER = mongoose.model("user", userSchema);

module.exports = {
    USER,
    validate
}