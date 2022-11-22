const express = require('express')
const router = express.Router()
const {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUserById,
} = require('../../controllers/userController')

router.route('/').get(getAllUsers).post(createUser)

router.route('/:id').get(getUserById).patch(updateUserById).delete(deleteUser)

module.exports = router
