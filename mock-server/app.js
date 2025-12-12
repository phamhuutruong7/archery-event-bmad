import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.js'
import eventRoutes from './routes/events.js'
import competitionRoutes from './routes/competitions.js'
import scoreRoutes from './routes/scores.js'
import userRoutes from './routes/users.js'
import athleteRoutes from './routes/athletes.js'
import refereeRoutes from './routes/referees.js'

const app = express()
app.use(cors())
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
