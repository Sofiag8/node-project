const express = require('express')
const {getAllTours, createTour, getTourById, deleteTour, updateTourById} = require('../controllers/tourController')

const router = express.Router();

router.route('/')
.get(getAllTours)
.post(createTour)

router.route('/:id')
.get(getTourById)
.delete(deleteTour)
.patch(updateTourById)


module.exports = router