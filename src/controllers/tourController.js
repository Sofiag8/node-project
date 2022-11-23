const AppError = require('../utils/appError')
const TourModel = require('../models/tourModel')
const catchAsync = require('../utils/catchAsync')

const parseQueryString = (queryStringObject) => {
  const rawQueryString = JSON.stringify(queryStringObject)
  const queryString = rawQueryString.replace(
    /\b(gte|gt|lte|lt)\b/g,
    (match) => `$${match}`
  )

  return JSON.parse(queryString)
}

const getAllTours = catchAsync(async (request, response, next) => {
  const queryStringObject = { ...request.query }
  const parsedQueryString = parseQueryString(queryStringObject)

  const tourList = await TourModel.find(parsedQueryString)

  response.status(200).json({
    status: 'success',
    total: tourList.length,
    data: {
      tourList,
    },
  })
})

const getTourById = catchAsync(async (request, response, next) => {
  const tour = await TourModel.findById(request.params.id)

  if (!tour) {
    return next(new AppError('No tour found', 404))
  }

  response.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  })
})

const updateTourById = catchAsync(async (request, response, next) => {
  const updatedTour = await TourModel.findByIdAndUpdate(
    request.params.id,
    request.body,
    {
      runValidators: true,
      new: true,
    }
  )

  if (!updatedTour) {
    return next(new AppError('No tour found to be updated', 404))
  }

  response.status(200).json({
    status: 'success',
    data: {
      tour: updatedTour,
    },
  })
})

const deleteTour = catchAsync(async (request, response, next) => {
  const deletedTour = await TourModel.findByIdAndDelete(request.params.id)

  if (!deletedTour) {
    return next(new AppError('No tour found to be deleted', 404))
  }

  response.status(204).json({
    status: 'success',
    data: deletedTour,
  })
})

const createTour = catchAsync(async (request, response, next) => {
  const createdTour = await TourModel.create(request.body)
  response.status(201).json({
    status: 'success',
    data: {
      tour: createdTour,
    },
  })
})

// aggregated pipeline
const getMonthlyPlan = catchAsync(async (request, response, next) => {
  const { year } = request.params

  const plan = await TourModel.aggregate([
    {
      // breaks nested documents into simple documents according to an specific field
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: {
          $month: '$startDates',
        },
        numTourStarts: { $sum: 1 },
        // push to create an array with specific field
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: {
        month: '$_id',
      },
    },
    {
      // project specify the inclution or not of a field
      $project: {
        // _id is not shown anymore
        _id: 0,
      },
    },
    {
      $sort: {
        numTourStarts: -1,
      },
    },
  ])

  response.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  })
})

module.exports = {
  updateTourById,
  getMonthlyPlan,
  getAllTours,
  getTourById,
  deleteTour,
  createTour,
}
