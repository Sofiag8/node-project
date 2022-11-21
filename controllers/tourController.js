const TourModel = require('./../models/tourModel')

const getAllTours = async (request, response) => {
    try {
        const queryObj = {...request.query}

        let queryString = JSON.stringify(queryObj)
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
        
        let allTours =  await TourModel.find(JSON.parse(queryString))

        response.status(200).json({
            status: 'success',
            results: allTours.length,
            data: {
                allTours
            }
        })
    } catch (error) {
        console.log(error)
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

// aggregated pipeline
const getMonthlyPlan = async (request, response) => {
    try {
        const {year} = request.params

        const plan = await TourModel.aggregate([
            {
                // breaks nested documents into simple documents according to an specific field
                $unwind: '$startDates'
            },
            {
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`)
                    }
                }
            },
            {            
                $group: {
                    _id: {
                        $month: '$startDates'
                    },
                    numTourStarts: {$sum: 1},
                    // push to create an array with specific field
                    tours: { $push: '$name'}
                }
            },
            {
                $addFields: {
                    month: '$_id'
                }
            },
            {
                // project specify the inclution or not of a field 
                $project: {
                    // _id is not shown anymore
                    _id: 0
                }
            },
            {
                $sort: {
                    numTourStarts: -1
                }
            }
        ])

        response.status(200).json({
            status: 'success',
            data: {
                plan
            }
        })
    } catch (error) {
        response.status(400).json({
            status: 'failed',
            message: `An error ocurred trying to get monthly plan ${error}`
        })   
    }
}

module.exports = {
    updateTourById,
    getMonthlyPlan,
    getAllTours,
    getTourById,
    deleteTour,
    createTour
}
