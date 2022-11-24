const express = require('express')
const {
  getAllTours,
  createTour,
  getTourById,
  deleteTour,
  updateTourById,
  getMonthlyPlan,
} = require('../../controllers/tourController')
const {
  isAuthenticated,
  isAuthorized,
} = require('../../controllers/authController')

const router = express.Router()

router.route('/').get(isAuthenticated, getAllTours).post(createTour)

router.route('/monthly-plan/:year').get(getMonthlyPlan)

router
  .route('/:id')
  .get(getTourById)
  .delete(isAuthenticated, isAuthorized('admin', 'lead-guide'), deleteTour)
  .patch(updateTourById)

module.exports = router
