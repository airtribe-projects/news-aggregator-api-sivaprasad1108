const express = require('express')
const router = express.Router()
const { signup, login } = require('../controllers/authController')
const { getPreferences, putPreferences } = require('../controllers/preferencesController')
const { authenticate } = require('../middleware/auth')

router.post('/signup', signup)
router.post('/login', login)
router.get('/preferences', authenticate, getPreferences)
router.put('/preferences', authenticate, putPreferences)

module.exports = router
