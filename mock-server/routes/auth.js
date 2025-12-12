import express from 'express'
import { getDb } from '../utils/db.js'

const router = express.Router()

// Login
router.post('/login', (req, res) => {
    const { email, password } = req.body
    const db = getDb()
    const user = db.users.find(u => u.email === email && u.password === password)

    if (user) {
        res.json({
            accessToken: `mock-token-${user.id}`,
            refreshToken: `mock-refresh-${user.id}`,
            expiresIn: 86400,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            }
        })
    } else {
        res.status(401).json({ error: 'Invalid credentials' })
    }
})

// Register
router.post('/register', (req, res) => {
    const { email, password, firstName, lastName } = req.body

    const newUser = {
        id: `user-${Date.now()}`,
        email,
        password,
        firstName,
        lastName,
        role: 'Athlete',
        phoneNumber: '',
        createdAt: new Date().toISOString()
    }

    res.status(201).json({
        accessToken: `mock-token-${newUser.id}`,
        refreshToken: `mock-refresh-${newUser.id}`,
        expiresIn: 86400,
        user: {
            id: newUser.id,
            email: newUser.email,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            role: newUser.role
        }
    })
})

// Refresh token
router.post('/refresh', (req, res) => {
    const { refreshToken } = req.body

    if (refreshToken && refreshToken.startsWith('mock-refresh-')) {
        const userId = refreshToken.replace('mock-refresh-', '')
        res.json({
            accessToken: `mock-token-${userId}`,
            expiresIn: 86400
        })
    } else {
        res.status(401).json({ error: 'Invalid refresh token' })
    }
})

// Logout
router.post('/logout', (req, res) => {
    res.json({ message: 'Logged out successfully' })
})

export default router
