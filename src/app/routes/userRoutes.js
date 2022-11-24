const express = require('express')
const router = express.Router()
const {
  updateUser,
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
} = require('../../controllers/userController')
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  isAuthenticated,
} = require('../../controllers/authController')

router.route('/').get(getAllUsers).post(createUser)

router.post('/signup', signup)
router.post('/login', login)
router.patch('/update-password', isAuthenticated, updatePassword)

router.post('/forgot-password', forgotPassword)
router.patch('/reset-password/:token', resetPassword)

router.patch('/update-user', isAuthenticated, updateUser)
router.delete('/delete-user', isAuthenticated, deleteUser)

router
  .route('/:id')
  .get(getUserById)
  .patch(updateUserById)
  .delete(deleteUserById)

module.exports = router
