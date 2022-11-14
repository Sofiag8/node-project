const fs = require('fs')
const express = require("express")

const app = express()
const port = 3000

// middleware
app.use(express.json())

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`))
app.get("/api/v1/tours", (request, response) => {
    response.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours
        }
    })
})

app.get("/api/v1/tours/:id", (request, response) => {
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
})

app.post("/api/v1/tours", (request, response) => {

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
})

app.listen(port, ()=> {
    console.log(`App running on port ${port}...`)
})