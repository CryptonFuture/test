const User = require('../models/User')
const Otp = require('../models/Otp')
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "e0e10f5e33e118",
        pass: "65ac37b3d995c0"
    }
})


exports.Register = async (req, res) => {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
        res.status(400).json({ success: false, message: "Please fill Out All Fields" })
    }

    try {

        const user = await User.findOne({ email: email })

        if (user) {
            res.status(400).json({ success: false, message: "Email Already Exists" })

        } else {
            const data = new User({
                name,
                email,
                password
            })

            const storeData = await data.save()

            res.status(200).json({ success: true, message: "User Register Successfully", storeData })
        }


    } catch (error) {
        res.status(500).json({ success: false, message: error.message })

    }
}

exports.userOtpSend = async (req, res) => {
    const { email } = req.body


    if (!email) {
        res.status(400).json({ success: false, message: "Please Enter your email" })
    }

    try {
        const user = await User.findOne({ email: email })

        if (user) {
            const otp = Math.floor(100000 + Math.random() * 900000)

            const existEmail = await Otp.findOne({ email: email })

            if (existEmail) {
                const updateData = await Otp.findByIdAndUpdate({ _id: existEmail._id }, {
                    otp: otp
                }, { new: true })

                await updateData.save()

                const mailOptions = {
                    from: process.env.EMAIL,
                    to: email,
                    subject: "Sending Eamil For Otp Validation",
                    text: `OTP:-${otp}`
                }

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log("error", error)
                        res.status(400).json({ success: false, error: "email not send" })
                    } else {
                        console.log("Email sent", info.response);
                        res.status(200).json({ success: true, message: "Email sent Successfully" })

                    }
                })
            } else {
                const saveOtpData = new Otp({
                    email, otp: otp
                })

                await saveOtpData.save()

                const mailOptions = {
                    from: process.env.EMAIL,
                    to: email,
                    subject: "Sending Eamil For Otp Validation",
                    text: `OTP:-${otp}`
                }

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log("error", error)
                        res.status(400).json({ success: false, error: "email not send" })
                    } else {
                        console.log("Email sent", info.response);
                        res.status(200).json({ success: true, message: "Email sent Successfully" })

                    }
                })
            }


        } else {
            res.status(400).json({ error: "This User Not Exist In our Db" })

        }


    } catch (error) {
        res.status(500).json({ success: false, message: error.message })

    }
}

exports.Login = async (req, res) => {
    const { email, otp } = req.body

    if (!email || !otp) {
        res.status(400).json({ success: false, message: "Please fill Out All Fields" })
    }

    try {
        const otpverify = await Otp.findOne({ email: email })

        if (otpverify.otp === otp) {
            const user = await User.findOne({ email: email })

            const token = await user.generateAuthtoken()
            res.status(200).json({success: false, message: "User Login Successfully Done", userToken: token })

        } else {
            res.status(400).json({ success: false, error: "Invalid Otp" })
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })

    }
}