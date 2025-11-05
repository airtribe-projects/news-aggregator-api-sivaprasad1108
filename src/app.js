require('dotenv').config()

const express = require('express')

// Mount contriollers and middleware
const { signup, login } = require('./controllers/authController')
const { getPreferences, putPreferences } = require('./controllers/preferencesController')
const { authenticate } = require('./middleware/auth')

// mounting routers
const usersRouter = require('./routes/users')
const newsRouter = require('./routes/news')
const errorHandler = require('./middleware/errorHandler')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Mount user-related routes under /users
app.use('/users', usersRouter)

// Mount news router at top-level /news
app.use('/news', newsRouter)


app.post('/register', signup)
app.post('/login', login)

// Preferences top-level endpoints
app.get('/preferences', authenticate, getPreferences)
app.put('/preferences', authenticate, putPreferences)

// Global error handler (last middleware)
app.use(errorHandler)

module.exports = app
