const express = require('express')
const {
  getAllTours,
  createTour,
  getTourById,
  deleteTour,
  updateTourById,
  getMonthlyPlan,
} = require('../../controllers/tourController')

const router = express.Router()

router.route('/').get(getAllTours).post(createTour)

router.route('/monthly-plan/:year').get(getMonthlyPlan)

router.route('/:id').get(getTourById).delete(deleteTour).patch(updateTourById)

module.exports = router
