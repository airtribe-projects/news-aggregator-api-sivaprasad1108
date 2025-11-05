const fs = require('fs')
const path = require('path')

const DATA_DIR = path.join(__dirname, '..', '..', 'data')
const USERS_FILE = path.join(DATA_DIR, 'users.json')

function loadUsers() {
    try {
        const raw = fs.readFileSync(USERS_FILE, 'utf8')
        return JSON.parse(raw || '{}')
    } catch (err) {
        return {}
    }
}

function saveUsers(users) {
    try {
        if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2))
    } catch (err) {
        console.error('Failed to save users', err)
    }
}

module.exports = { loadUsers, saveUsers }
