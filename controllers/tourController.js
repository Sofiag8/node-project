const TourModel = require('./../models/tourModel')

const getAllTours = async(request, response) => {
    try {
        const allTours = await TourModel.find()
        response.status(200).json({
            status: 'success',
            results: allTours.length,
            data: {
                allTours
            }
        })
    } catch (error) {
        response.status(404).json({
            status: 'failed',
            message: `An error ocurred trying to find all tours ${error}`
        })
    }
}

const getTourById = async (request, response) => {
    try {
        const tour = await TourModel.findById(request.params.id)
        response.status(200).json({
            status: 'success',
            data: {
                tour
            }
        })
    } catch (error) {
        response.status(404).json({
            status: 'failed',
            message: `An error ocurred trying to find a tour by Id ${error}`
        })
    }
}

const updateTourById = async (request, response) => {
    try {
        const updatedTour = await TourModel.findByIdAndUpdate(request.params.id, request.body, {
            new : true
        })
        response.status(200).json({
            status: 'success',
            data: {
                tour: updatedTour
            }
        })
    } catch (error) {
        response.status(404).json({
            status: 'failed',
            message: `An error ocurred trying to update a tour by Id ${error}`
        })
    }
}

const deleteTour = async (request, response) => {
  try {
    const deletedTour = await TourModel.findByIdAndDelete(request.params.id)
    response.status(204).json({
        status: 'success',
        data: deletedTour
    })
  } catch (error) {
    response.status(404).json({
        status: 'failed',
        message: `An error ocurred trying to delete a tour ${error}`
    })
  }
}

const createTour = async (request, response) => {
    try {
            const createdTour = await TourModel.create(request.body)
            response.status(201).json({
                status: 'success',
                data: {
                    tour: createdTour
                }
            })
    } catch (error) {
        response.status(400).json({
            status: 'failed',
            message: `An error ocurred trying to create a new tour record ${error}`
        })
    }
}

module.exports = {
    updateTourById,
    getAllTours,
    getTourById,
    deleteTour,
    createTour
}
