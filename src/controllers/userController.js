const AppError = require('../utils/appError')
const UserModel = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')
const User = require('../models/userModel')

const getAllUsers = catchAsync(async (_request, response, next) => {
  const allUsers = await UserModel.find()
  response.status(200).json({
    status: 'success',
    results: allUsers.length,
    data: {
      allUsers,
    },
  })
})

// admin functionality
const deleteUserById = catchAsync(async (request, response, next) => {
  const deletedUser = await UserModel.findByIdAndDelete(request.params.id)

  if (!deletedUser) {
    return next(new AppError('No user found to be deleted', 404))
  }

  response.status(204).json({
    status: 'success',
    data: deletedUser,
  })
})

// admin functionality
const updateUserById = catchAsync(async (request, response, next) => {
  const updatedUser = await UserModel.findByIdAndUpdate(
    request.params.id,
    request.body,
    {
      new: true,
    }
  )

  if (!updatedUser) {
    return next(new AppError('No user found to be updated', 404))
  }

  response.status(200).json({
    status: 'success',
    data: {
      tour: updatedUser,
    },
  })
})

// admin functionality
const createUser = catchAsync(async (request, response, next) => {
  const createdUser = await UserModel.create(request.body)
  response.status(201).json({
    status: 'success',
    data: {
      tour: createdUser,
    },
  })
})

const getUserById = catchAsync(async (request, response, next) => {
  const user = await UserModel.findById(request.params.id)

  if (!user) {
    return next(new AppError('No user found', 404))
  }

  response.status(200).json({
    status: 'success',
    data: {
      user,
    },
  })
})

const updateUser = catchAsync(async (request, response, next) => {
  if (request.body.password || request.body.passwordConfirm) {
    return next(new AppError('Trying to update password is not allowed', 400))
  }

  const updatedUser = await UserModel.findByIdAndUpdate(
    request.user._id,
    {
      ...(request.body?.name && { name: request.body.name }),
      ...(request.body?.email && { email: request.body.email }),
    },
    {
      new: true,
      runValidators: true,
    }
  )

  if (!updatedUser) {
    return next(new AppError('No user found to be updated', 404))
  }

  response.status(200).json({
    status: 'success',
    data: {
      tour: updatedUser,
    },
  })
})

const deleteUser = catchAsync(async (request, response, next) => {
  await UserModel.findByIdAndUpdate(request.user._id, { active: false })
  response.status(204).json({
    status: 'success',
    data: null,
  })
})

module.exports = {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
  updateUserById,
  deleteUserById,
}
