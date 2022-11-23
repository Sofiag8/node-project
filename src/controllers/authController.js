const { promisify } = require('util')
const AppError = require('../utils/appError')
const UserModel = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')
const { generateJwt } = require('../utils')
const jwt = require('jsonwebtoken')
const config = require('../config')

const signup = catchAsync(async (request, response, next) => {
  const createdUser = await UserModel.create({
    name: request.body.name,
    role: request.body.role,
    email: request.body.email,
    password: request.body.password,
    passwordConfirm: request.body.passwordConfirm,
  })
  const token = generateJwt(createdUser._id)

  response.status(201).json({
    status: 'success',
    user: createdUser,
    token,
  })
})

const login = catchAsync(async (request, response, next) => {
  const { email, password } = request.body
  if (!email || !password) {
    return next(new AppError('Email and password are required', 400))
  }

  const user = await UserModel.findOne({ email }).select('password')
  if (!user || !(await user.isValidPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401))
  }

  const token = generateJwt(user._id)

  response.status(201).json({
    status: 'success',
    token,
  })
})

// middleware function to tour routes
const isAuthenticated = catchAsync(async (request, response, next) => {
  let token
  if (
    request.headers.authorization &&
    request.headers.authorization.startsWith('Bearer')
  ) {
    token = request.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return next(new AppError('User is not currently logged in', 401))
  }

  const decoded = await promisify(jwt.verify)(token, config.jwtKey)

  const checkUserExists = await UserModel.findById(decoded.id)
  if (!checkUserExists) {
    return next(
      new AppError(
        'User belonging to token payload id does not exist anymore ',
        401
      )
    )
  }

  if (checkUserExists.checkIfPasswordHasChanged(decoded.iat)) {
    return next(new AppError('User has changed password, log in again', 401))
  }

  request.user = checkUserExists
  next()
})

const isAuthorized = (...roles) => {
  return (request, response, next) => {
    if (!roles.includes(request.user.role)) {
      return next(
        new AppError('User is not authorized to perform this action', 403)
      )
    }
    next()
  }
}

module.exports = {
  isAuthenticated,
  isAuthorized,
  signup,
  login,
}
