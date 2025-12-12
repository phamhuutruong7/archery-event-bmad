import express from 'express'
import { getDb, saveDb } from '../utils/db.js'

const router = express.Router()

// Get all athletes for an event
router.get('/:eventId/athletes', (req, res) => {
  const { eventId } = req.params
  const db = getDb()

  const event = db.events.find(e => e.id === eventId)
  if (!event) {
    return res.status(404).json({ message: 'Event not found' })
  }

  // Get athletes from database or return empty array
  const athletes = db.athletes || []
  res.json({ athletes })
})

// Get athletes for a specific competition
router.get('/:eventId/competitions/:competitionId/athletes', (req, res) => {
  const { eventId, competitionId } = req.params
  const { bowType, category, round, subround } = req.query
  const db = getDb()

  const event = db.events.find(e => e.id === eventId)
  if (!event) {
    return res.status(404).json({ message: 'Event not found' })
  }

  // Get athletes registered for this competition
  let athletes = db.competitionAthletes?.[competitionId] || []

  // If no specific athletes for this competition, filter from all athletes based on competition criteria
  if (athletes.length === 0) {
    athletes = db.athletes || []

    // Filter by bow type if specified
    if (bowType) {
      athletes = athletes.filter(a => a.bowType === bowType)
    }

    // Filter by category gender if specified (Men's or Women's)
    if (category) {
      if (category.includes("Men's") && !category.includes("Women's")) {
        // Men's category - filter for male athletes (for demo, alternate athletes)
        athletes = athletes.filter((_, index) => index % 3 !== 2)
      } else if (category.includes("Women's")) {
        // Women's category - filter for female athletes (for demo, alternate athletes)
        athletes = athletes.filter((_, index) => index % 3 === 2)
      }
    }
  }

  res.json({ athletes })
})

// Get registered athletes with equipment check status
router.get('/:eventId/registered-athletes', (req, res) => {
  const { eventId } = req.params
  const db = getDb()

  const event = db.events.find(e => e.id === eventId)
  if (!event) {
    return res.status(404).json({ message: 'Event not found' })
  }

  const athletes = [
    { id: '1-recurve', athleteId: '1', name: 'John Smith', team: 'Archery Club A', bowType: 'Recurve', equipmentChecked: true },
    { id: '1-compound', athleteId: '1', name: 'John Smith', team: 'Archery Club A', bowType: 'Compound', equipmentChecked: false },
    { id: '2-compound', athleteId: '2', name: 'Sarah Johnson', team: 'Archery Club A', bowType: 'Compound', equipmentChecked: false },
    { id: '3-recurve', athleteId: '3', name: 'Michael Chen', team: 'Archery Club B', bowType: 'Recurve', equipmentChecked: true },
    { id: '3-barebow', athleteId: '3', name: 'Michael Chen', team: 'Archery Club B', bowType: 'Barebow', equipmentChecked: false },
    { id: '4-barebow', athleteId: '4', name: 'Emily Davis', team: 'Archery Club C', bowType: 'Barebow', equipmentChecked: false },
    { id: '5-recurve', athleteId: '5', name: 'David Wilson', team: 'Archery Club B', bowType: 'Recurve', equipmentChecked: true },
    { id: '6-compound', athleteId: '6', name: 'Lisa Anderson', team: 'Archery Club A', bowType: 'Compound', equipmentChecked: true },
    { id: '7-recurve', athleteId: '7', name: 'James Martinez', team: 'Archery Club C', bowType: 'Recurve', equipmentChecked: false },
    { id: '7-barebow', athleteId: '7', name: 'James Martinez', team: 'Archery Club C', bowType: 'Barebow', equipmentChecked: false },
    { id: '8-barebow', athleteId: '8', name: 'Anna Taylor', team: 'Archery Club D', bowType: 'Barebow', equipmentChecked: true },
  ]

  res.json({ athletes })
})

// Update equipment check status
router.patch('/:eventId/athletes/:athleteId/equipment-check', (req, res) => {
  const { eventId, athleteId } = req.params
  const { bowType, checked } = req.body

  // Just acknowledge the update (in a real app, this would update the database)
  console.log(`Equipment check updated for athlete ${athleteId} (${bowType}): ${checked}`)

  res.json({
    success: true,
    message: 'Equipment check status updated'
  })
})

// Register athlete for competitions
router.post('/:eventId/athletes/:athleteId/register', (req, res) => {
  const { eventId, athleteId } = req.params
  const { competitionIds } = req.body

  console.log(`Athlete ${athleteId} registered for competitions:`, competitionIds)

  res.json({
    success: true,
    message: 'Successfully registered for competitions'
  })
})

export default router
