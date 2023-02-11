const User = require('../models/User')

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