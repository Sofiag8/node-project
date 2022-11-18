const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: {
      type: String,
      required: [true, 'An user must have a name'],
      unique: true
  },
  email: {
    type: String,
    required: [true, 'An user must have an unique email'],
    unique: true
  },
  role: {
    type: String
  },
  active: {
    type: Boolean,
    default: true
  },
  photo: {
    type: String
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User
