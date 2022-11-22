const morgan = require('morgan')
const express = require('express')
const config = require('../config')
const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')

const app = express()
// middleware
if (config.env === 'development') {
  app.use(morgan('dev'))
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

// unhandled routes middleware
app.all('*', (request, response, next) => {
  response.status(404).json({
    status: 'failed',
    message: `Cant find ${request.originalUrl} on this server!`,
  })
})

module.exports = app
