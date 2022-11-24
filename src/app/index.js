const morgan = require('morgan')
const express = require('express')
const path = require('path')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const hpp = require('hpp')
const xss = require('xss-clean')
const config = require('../config')
const appError = require('../utils/appError')
const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')
const viewRouter = require('./routes/viewRoutes')
const errorController = require('../controllers/errorController')

const app = express()

app.set('view engine', 'pug')
app.set('views', __dirname + './../views')

// Serving static files
app.use(express.static(__dirname + './../public'))

// Security http headers
// app.use(helmet()) -- uncomment after server side renderig

// Development loggin
if (config.env === 'development') {
  app.use(morgan('dev'))
}

// Limit requests
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour',
})
app.use('/api', limiter)

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }))

// Data sanitization against NoSQL query injection
app.use(mongoSanitize())

// Data sanitization against cross site attacks
app.use(xss())

// Prevent parameter polution
app.use(
  hpp({
    whitelist: [
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'duration',
      'price',
    ],
  })
)

// Middleware test
app.use((request, response, next) => {
  response.requestTime = new Date().toDateString()
  next()
})

// routes
app.use('/', viewRouter)

app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)

// unhandled routes middleware
app.all('*', (request, response, next) => {
  next(new appError(`Cant find ${request.originalUrl} on this server!`, 404))
})

app.use(errorController)

module.exports = app
