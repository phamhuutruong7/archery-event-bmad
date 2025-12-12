import express from 'express'
import { getDb, saveDb } from '../utils/db.js'

const router = express.Router()

router.get('/', (req, res) => {
    const db = getDb()
    const { athleteId, competitionId } = req.query

    let scores = db.scores
    if (athleteId) scores = scores.filter(s => s.athleteId === athleteId)
    if (competitionId) scores = scores.filter(s => s.competitionId === competitionId)

    res.json(scores)
})

router.post('/', (req, res) => {
    const { competitionId, endNumber, arrowScores } = req.body
    const authHeader = req.headers.authorization

    let athleteId = 'user-002'
    if (authHeader && authHeader.startsWith('Bearer mock-token-')) {
        athleteId = authHeader.replace('Bearer mock-token-', '')
    }

    const db = getDb()
    const endScore = arrowScores.reduce((sum, score) => sum + score, 0)
    const athleteScores = db.scores.filter(s =>
        s.athleteId === athleteId && s.competitionId === competitionId
    )
    const previousTotal = athleteScores.reduce((sum, s) => sum + s.endScore, 0)

    const newScore = {
        id: `score-${Date.now()}`,
        athleteId,
        competitionId,
        endNumber,
        arrowScores,
        endScore,
        totalScore: previousTotal + endScore,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }

    db.scores.push(newScore)
    saveDb(db)
    res.status(201).json(newScore)
})

router.put('/:id', (req, res) => {
    const db = getDb()
    const index = db.scores.findIndex(s => s.id === req.params.id)

    if (index === -1) {
        return res.status(404).json({ error: 'Score not found' })
    }

    const { arrowScores } = req.body
    const endScore = arrowScores.reduce((sum, score) => sum + score, 0)

    db.scores[index] = {
        ...db.scores[index],
        arrowScores,
        endScore,
        updatedAt: new Date().toISOString()
    }

    saveDb(db)
    res.json(db.scores[index])
})

export default router
