const express = require('express')
const {getAllTours, createTour, getTourById, deleteTour, updateTourById, checkIdMiddleware, checkBodyMiddleware} = require('../controllers/tourController')

const router = express.Router();

router.param('id', checkIdMiddleware)

router.route('/')
.get(getAllTours)
.post(checkBodyMiddleware, createTour)

router.route('/:id')
.get(getTourById)
.delete(deleteTour)
.patch(updateTourById)


module.exports = router