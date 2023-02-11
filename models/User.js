const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

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

    password: {
        type: String,
        required: true,
        minlength: 6
    },

    token: [
        {
            token: {
                type: String,
                required: true,

            }
        }
    ]
})

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10)
    }
    next()
})

module.exports = mongoose.model("user", userSchema)