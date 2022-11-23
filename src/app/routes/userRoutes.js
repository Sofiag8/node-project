const express = require('express')
const router = express.Router()
const {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUserById,
} = require('../../controllers/userController')
const { signup, login } = require('../../controllers/authController')

router.route('/').get(getAllUsers)

router.post('/signup', signup)
router.post('/login', login)

router.route('/:id').get(getUserById).patch(updateUserById).delete(deleteUser)

module.exports = router
