import express from 'express'
import { getDb } from '../utils/db.js'

const router = express.Router()

// Get competitions (optionally filter by eventId)
router.get('/', (req, res) => {
    const db = getDb()
    const { eventId } = req.query

    let competitions = db.competitions
    if (eventId) competitions = competitions.filter(c => c.eventId === eventId)

    res.json(competitions)
})

router.get('/:id', (req, res) => {
    const db = getDb()
    const competition = db.competitions.find(c => c.id === req.params.id)
    competition ? res.json(competition) : res.status(404).json({ error: 'Competition not found' })
})

router.get('/:id/leaderboard', (req, res) => {
    const db = getDb()
    const leaderboard = db.leaderboards.find(l => l.competitionId === req.params.id)
    leaderboard ? res.json(leaderboard) : res.status(404).json({ error: 'Leaderboard not found' })
})

// Get target assignments for a competition
router.get('/:id/target-assignments', (req, res) => {
    const db = getDb()
    const assignment = db.targetAssignments?.find(a => a.competitionId === req.params.id)

    if (assignment) {
        res.json(assignment)
    } else {
        // Return empty assignment structure if none exists
        res.json({
            competitionId: req.params.id,
            targets: [],
            lastUpdated: null
        })
    }
})

// Save target assignments for a competition
router.post('/:id/target-assignments', (req, res) => {
    const db = getDb()
    const { targets } = req.body

    if (!db.targetAssignments) {
        db.targetAssignments = []
    }

    // Remove existing assignment for this competition
    db.targetAssignments = db.targetAssignments.filter(a => a.competitionId !== req.params.id)

    // Add new assignment
    const newAssignment = {
        competitionId: req.params.id,
        targets: targets,
        lastUpdated: new Date().toISOString()
    }

    db.targetAssignments.push(newAssignment)

    res.json({
        success: true,
        message: 'Target assignments saved successfully',
        assignment: newAssignment
    })
})

export default router
