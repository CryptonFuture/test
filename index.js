const app = require('./app')
const dotenv = require('dotenv')
const connectDatabase = require('./config/database')

dotenv.config({path: "./config/config.env"})

connectDatabase()

app.listen(process.env.PORT, () => {
    console.log('Server is start from localhost on Port ' + process.env.PORT)
})