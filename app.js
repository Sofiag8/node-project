const morgan = require("morgan")
const express = require("express")
const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')
const { nextTick } = require("process")

const app = express()

// middleware
app.use(morgan("dev"))
app.use(express.json())
app.use((request, response, next) => {
    response.requestTime = new Date().toDateString()
    next()
})


// routes
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)


module.exports = app
