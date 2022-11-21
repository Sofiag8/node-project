const mongoose = require('mongoose')
const slugify = require('slugify')

const tourSchema = new mongoose.Schema({
  name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less than 40 characters'],
      minlength: [10, 'A tour name must have at leat 10 characters']
  },
  slug: String,
  duration: {
    type: Number,
    required: [true, 'A tour must have a duration']
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a group size']
  },
  ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'A tour must have a minimum rate of 1'],
      max: [5, 'A tour rate cannot be greater than 5']
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  difficulty: {
    type: String,
    required: [true, ' A tour must have a difficulty'],
    enum: {
      values: ['easy', 'medium', 'difficult'],
      message: 'A tour has three specific types of difficulty: easy, medium or difficult'
    }
  },
  price: {
      type: Number,
      required: [true, 'A tour must have a price']
  },
  priceDiscount : {
    type: Number
  },
  summary: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    required: [true, 'A tour must have a description']
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have a cover image']
  },
  images: {
    type: [String]
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  startDates: {
    type: [Date]
  }
},
{
  toJSON: {virtuals: true},
  toObject: { virtuals: true}
})

tourSchema.virtual('durationWeeks').get(function() {return this.duration / 7})

// Middleware, runs before save and create
tourSchema.pre('save', function ( next ) {
  this.slug = slugify(this.name, { lower: true })
  next()
})

const Tour = mongoose.model('Tour', tourSchema)

module.exports = Tour
