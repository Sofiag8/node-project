
const fs = require('fs')

const users = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/users.json`))

const getAllUsers = (_request, response) => {
    response.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users
        }
    })
}

const createUser = (request, response) => {

    const newId = users[users.length -1].id  + 1
    const newUser = Object.assign({id: newId}, request.body)

    users.push(newUser)

    fs.writeFile(`${__dirname}/dev-data/data/users.json`, JSON.stringify(users), err => {
        response.status(201).json({
            status: 'success',
            data: {
                user: newUser
            }
        })
    })
}

const deleteUser = (request, response) => {
    if (Number(request.params.id) > users.length) {
        return response.status(404).json({
            status: 'failed',
            message: 'Id could not be found on records'
        })
    }
    response.status(204).json({
        status: 'success',
        data: null
    })
}

const updateUserById =(request, response) => {
    if (Number(request.params.id) > users.length) {
        return response.status(404).json({
            status: 'failed',
            message: 'Id could not be found on records'
        })
    }
    response.status(200).json({
        status: 'success',
        data: {
            user: 'updated tour here'
        }
    })
}

const getUserById = (request, response) => {
    const user = users.find(el => el._id === request.params.id)
    if (!user) {
        return response.status(404).json({
            status: 'failed',
            message: 'Id could not be found on records'
        })
    }
    response.status(200).json({
        status: 'success',
        data: {
            user
        }
    })
}

module.exports = {
    createUser,
    deleteUser,
    getAllUsers,
    getUserById,
    updateUserById,
}
