const express = require('express')
const controllers = require('../controllers/controllers')

const router = express()

router.route('/register').post(controllers.Register)
router.route('/sendotp').post(controllers.userOtpSend)
router.route('/login').post(controllers.Login)

module.exports = router