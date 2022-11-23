const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'An user must have a name'],
    unique: true,
  },
  email: {
    type: String,
    required: [true, 'An user must have an unique email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, ' Please provide a valid email'],
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  active: {
    type: Boolean,
    default: true,
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function (el) {
        return el === this.password
      },
      message: 'Passwords are not the same',
    },
  },
  passwordChangedAt: {
    type: Date,
  },
})

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next

  this.password = await bcrypt.hash(this.password, 12)
  this.passwordConfirm = undefined

  next()
})

// Instance method to validate password. Cannot be use password from document because is selected as false
userSchema.methods.isValidPassword = async function (
  candidatePassword,
  userPassword
) {
  return bcrypt.compare(candidatePassword, userPassword)
}

userSchema.methods.checkIfPasswordHasChanged = function (jwtTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    )
    return jwtTimestamp < changedTimestamp
  }
  return false
}

const User = mongoose.model('User', userSchema)

module.exports = User
