const express = require('express')
const router = express.Router()
const { getNews } = require('../controllers/newsController')
const { authenticate } = require('../middleware/auth')

router.get('/', authenticate, getNews)

module.exports = router
