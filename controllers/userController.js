const UserModel = require('./../models/userModel')

const getAllUsers = async (_request, response) => {
    try {
        const allUsers = await UserModel.find()
        response.status(200).json({
            status: 'success',
            results: allUsers.length,
            data: {
                allUsers
            }
        })
    } catch (error) {
        response.status(404).json({
            status: 'failed',
            message: `An error ocurred trying to find all users ${error}`
        })
    }
}

const createUser = async (request, response) => {
    try {
        const createdUser = await UserModel.create(request.body)
        response.status(201).json({
            status: 'success',
            data: {
                tour: createdUser
            }
        })
    } catch (error) {
        response.status(400).json({
            status: 'failed',
            message: `An error ocurred trying to create a new user record ${error}`
        })
    }
}

const deleteUser = async (request, response) => {
    try {
        const deletedUser = await UserModel.findByIdAndDelete(request.params.id)
        response.status(204).json({
            status: 'success',
            data: deletedUser
        })
      } catch (error) {
        response.status(404).json({
            status: 'failed',
            message: `An error ocurred trying to delete an user ${error}`
        })
      }
}

const updateUserById =async (request, response) => {
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(request.params.id, request.body, {
        new : true
        })
        response.status(200).json({
            status: 'success',
            data: {
                tour: updatedUser
            }
        })
    } catch (error) {
        response.status(404).json({
            status: 'failed',
            message: `An error ocurred trying to update an user by Id ${error}`
        })
    }
}

const getUserById = async (request, response) => {
    try {
        const user = await UserModel.findById(request.params.id)
        response.status(200).json({
            status: 'success',
            data: {
                user
            }
        })
    } catch (error) {
        response.status(404).json({
            status: 'failed',
            message: `An error ocurred trying to find an user by Id ${error}`
        })
    }
}

module.exports = {
    createUser,
    deleteUser,
    getAllUsers,
    getUserById,
    updateUserById,
}
