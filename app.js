const express = require('express')
const cors = require('cors')
const routers = require('./routers/routers')

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())

app.use('/api/v1', routers)

app.get('/', (req, res) => {
    res.send("Server is working")
})

module.exports = app