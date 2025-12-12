import express from 'express'
import { getDb } from '../utils/db.js'

const router = express.Router()

router.get('/me', (req, res) => {
    const authHeader = req.headers.authorization
    let userId = 'user-002'
    if (authHeader && authHeader.startsWith('Bearer mock-token-')) {
        userId = authHeader.replace('Bearer mock-token-', '')
    }

    const db = getDb()
    const user = db.users.find(u => u.id === userId)

    if (user) {
        const { password, ...userWithoutPassword } = user
        res.json(userWithoutPassword)
    } else {
        res.status(404).json({ error: 'User not found' })
    }
})

export default router
