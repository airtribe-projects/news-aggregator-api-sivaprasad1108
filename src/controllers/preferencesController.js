const { loadUsers, saveUsers } = require('../models/userStore')

function getPreferences(req, res) {
    return res.status(200).send({ preferences: req.user.preferences })
}

function putPreferences(req, res) {
    const { preferences } = req.body || {}
    if (!Array.isArray(preferences)) return res.status(400).send({ error: 'preferences must be an array' })
    const users = loadUsers()
    const user = users[req.userEmail]
    if (!user) return res.status(404).send({ error: 'user not found' })
    user.preferences = preferences
    users[req.userEmail] = user
    saveUsers(users)
    return res.status(200).send({ success: true })
}

module.exports = { getPreferences, putPreferences }
