const express = require('express')
const {
  updateUserData,
  getLoginForm,
  getOverview,
  getAccount,
  getTour,
} = require('../../controllers/viewsController')
const {
  isAuthenticated,
  isAuthorized,
} = require('../../controllers/authController')

const router = express.Router()

router.get('/', isAuthenticated, getOverview)
router.get('/tour/:slug', isAuthenticated, getTour)
router.get('/login', isAuthenticated, getLoginForm)
router.get('/me', isAuthorized, getAccount)

router.post('/submit-user-data', isAuthorized, updateUserData)

module.exports = router
