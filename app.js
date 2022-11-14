const fs = require('fs')
const express = require("express")
const morgan = require("morgan")

const app = express()
const port = 3000

// middleware
app.use(morgan("dev"))


const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`))

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


// routes
app.route('/api/v1/tours')
.get(getAllTours)
.post(createTour)

app.route('/api/v1/tours/:id')
.get(getTourById)
.patch(updateTourById)
.delete(deleteTour)

// server
app.listen(port, ()=> {
    console.log(`App running on port ${port}...`)
})