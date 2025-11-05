const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { loadUsers, saveUsers } = require('../models/userStore')

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me'

function signup(req, res) {
    const { name, email, password, preferences } = req.body || {}
    if (!email) return res.status(400).send({ error: 'email required' })
    const users = loadUsers()
    const hashed = password ? bcrypt.hashSync(password, 8) : ''
    users[email] = {
        name: name || '',
        email,
        password: hashed,
        preferences: Array.isArray(preferences) ? preferences : []
    }
    saveUsers(users)
    return res.status(200).send({ success: true })
}

function login(req, res) {
    const { email, password } = req.body || {}
    if (!email || !password) return res.status(400).send({ error: 'email and password required' })
    const users = loadUsers()
    const user = users[email]
    if (!user) return res.status(401).send({ error: 'invalid credentials' })
    if (!bcrypt.compareSync(password, user.password)) return res.status(401).send({ error: 'invalid credentials' })
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '2h' })
    return res.status(200).send({ token })
}

module.exports = { signup, login }
