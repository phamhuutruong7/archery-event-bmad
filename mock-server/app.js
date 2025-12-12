import express from 'express'
import authRoutes from './routes/auth.js'
import eventRoutes from './routes/events.js'
import competitionRoutes from './routes/competitions.js'
import scoreRoutes from './routes/scores.js'
import userRoutes from './routes/users.js'
import athleteRoutes from './routes/athletes.js'
import refereeRoutes from './routes/referees.js'

const app = express()

// Manual CORS middleware - must be first
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Access-Control-Max-Age', '86400')

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        return res.status(204).end()
    }

    next()
})

app.use(express.json())

// Add delay middleware
app.use((req, res, next) => {
    setTimeout(next, 100)
})

// Register Routes
app.use('/auth', authRoutes)
app.use('/api/v1/events', eventRoutes)
app.use('/api/v1/events', athleteRoutes)
app.use('/api/v1/events', refereeRoutes)
app.use('/api/v1/competitions', competitionRoutes)
app.use('/api/v1/scores', scoreRoutes)
app.use('/api/v1/users', userRoutes)

// Default root route for health check
app.get('/', (req, res) => {
    res.send('Archery Event Mock Server is running!')
})

export default app
