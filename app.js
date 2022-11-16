const morgan = require("morgan")
const express = require("express")
const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')
const config = require('./config/index')

const app = express()

// middleware
if (config.env === 'development') {
    app.use(morgan("dev"))
}
app.use(express.json())
app.use((request, response, next) => {
    response.requestTime = new Date().toDateString()
    next()
})

app.use(express.static(`${__dirname}/public`))


// routes
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)


module.exports = app
