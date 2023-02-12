const mongoose = require('mongoose')
const validator = require('validator')

const userOtpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Not valid Email")
            }
        }
    },

    otp: {
        type: String,
        required: true
    }
})

module.exports =  mongoose.model("otp", userOtpSchema)