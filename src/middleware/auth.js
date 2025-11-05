const jwt = require('jsonwebtoken')
const { loadUsers } = require('../models/userStore')

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me'

function authenticate(req, res, next) {
    const auth = req.get('Authorization') || ''
    if (!auth.startsWith('Bearer ')) return res.status(401).send({ error: 'Unauthorized' })
    const token = auth.slice(7).trim()
    try {
        const payload = jwt.verify(token, JWT_SECRET)
        const users = loadUsers()
        const user = users[payload.email]
        if (!user) return res.status(401).send({ error: 'Unauthorized' })
        req.user = user
        req.userEmail = payload.email
        next()
    } catch (err) {
        return res.status(401).send({ error: 'Unauthorized' })
    }
}

module.exports = { authenticate }
