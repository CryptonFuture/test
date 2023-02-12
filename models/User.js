const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const JWT_SECRET = "asdfghjklzxcvbnmqwertyuiop"

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

    tokens: [
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

userSchema.methods.generateAuthtoken = async function (req, res) {
    try {
        let newtoken = jwt.sign({ _id: this._id }, JWT_SECRET, {
            expiresIn: "1d"
        });

        this.tokens = this.tokens.concat({ token: newtoken });
        await this.save();
        return newtoken;
    } catch (error) {
    }
}

module.exports = mongoose.model("user", userSchema)