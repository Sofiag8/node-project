const fs = require('fs')
const express = require("express")
const morgan = require("morgan")

const app = express()
const port = 3000

// middleware
app.use(morgan("dev"))
app.use(express.json())

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`))
const users = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/users.json`))


// route handlers
const getAllTours = (_request, response) => {
    response.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours
        }
    })
}

const getTourById = (request, response) => {
    const tour = tours.find(el => el.id === Number(request.params.id))
    if (!tour) {
        return response.status(404).json({
            status: 'failed',
            message: 'Id could not be found on records'
        })
    }
    console.log(tour)
    response.status(200).json({
        status: 'success',
        data: {
            tour
        }
    })
}

const updateTourById =(request, response) => {
    if (Number(request.params.id) > tours.length) {
        return response.status(404).json({
            status: 'failed',
            message: 'Id could not be found on records'
        })
    }
    response.status(200).json({
        status: 'success',
        data: {
            tour: 'updated tour here'
        }
    })
}

const deleteTour = (request, response) => {
    if (Number(request.params.id) > tours.length) {
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

const createTour = (request, response) => {

    const newId = tours[tours.length -1].id  + 1
    const newTour = Object.assign({id: newId}, request.body)

    tours.push(newTour)

    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        response.status(201).json({
            status: 'success',
            data: {
                tour:newTour
            }
        })
    })
}

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

// routes
app.route('/api/v1/tours')
.get(getAllTours)
.post(createTour)

app.route('/api/v1/tours/:id')
.get(getTourById)
.patch(updateTourById)
.delete(deleteTour)

app.route('/api/v1/users')
.get(getAllUsers)
.post(createUser)

app.route('/api/v1/users/:id')
.get(getUserById)
.patch(updateUserById)
.delete(deleteUser)

// server
app.listen(port, ()=> {
    console.log(`App running on port ${port}...`)
})