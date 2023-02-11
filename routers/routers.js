const express = require('express')
const controllers = require('../controllers/controllers')

const router = express()

router.route('/register').post(controllers.Register)

module.exports = router