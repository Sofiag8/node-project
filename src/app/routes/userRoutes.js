const express = require('express')
const router = express.Router()
const {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUserById,
} = require('../../controllers/userController')
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
} = require('../../controllers/authController')

router.route('/').get(getAllUsers).post(createUser)

router.post('/signup', signup)
router.post('/login', login)

router.post('/forgot-password', forgotPassword)
router.patch('/reset-password/:token', resetPassword)

router.route('/:id').get(getUserById).patch(updateUserById).delete(deleteUser)

module.exports = router
