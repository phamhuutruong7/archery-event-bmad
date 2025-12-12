import express from 'express'
import { getDb, saveDb } from '../utils/db.js'

const router = express.Router()

// Get all referees for an event
router.get('/:eventId/referees', (req, res) => {
  const { eventId } = req.params
  const db = getDb()

  const event = db.events.find(e => e.id === eventId)
  if (!event) {
    return res.status(404).json({ message: 'Event not found' })
  }

  const referees = [
    {
      id: '1',
      fullName: 'Michael Anderson',
      country: 'United States',
      countryCode: 'US'
    },
    {
      id: '2',
      fullName: 'Sophie Laurent',
      country: 'France',
      countryCode: 'FR'
    },
    {
      id: '3',
      fullName: 'Hiroshi Yamamoto',
      country: 'Japan',
      countryCode: 'JP'
    },
    {
      id: '4',
      fullName: 'Elena Rodriguez',
      country: 'Spain',
      countryCode: 'ES'
    },
    {
      id: '5',
      fullName: 'Thomas Becker',
      country: 'Germany',
      countryCode: 'DE'
    },
    {
      id: '6',
      fullName: 'Linda Chen',
      country: 'China',
      countryCode: 'CN'
    }
  ]

  res.json({ referees })
})

// Get registered referees with attendant status
router.get('/:eventId/registered-referees', (req, res) => {
  const { eventId } = req.params
  const db = getDb()

  const event = db.events.find(e => e.id === eventId)
  if (!event) {
    return res.status(404).json({ message: 'Event not found' })
  }

  const referees = [
    { id: '1', name: 'John Anderson', country: 'United States', countryCode: 'us', attendant: true },
    { id: '2', name: 'Maria Garcia', country: 'Spain', countryCode: 'es', attendant: false },
    { id: '3', name: 'Yuki Tanaka', country: 'Japan', countryCode: 'jp', attendant: true },
    { id: '4', name: 'Hans Mueller', country: 'Germany', countryCode: 'de', attendant: false },
    { id: '5', name: 'Sophie Martin', country: 'France', countryCode: 'fr', attendant: true },
    { id: '6', name: 'Kim Min-jun', country: 'South Korea', countryCode: 'kr', attendant: true },
  ]

  res.json({ referees })
})

// Update referee attendant status
router.patch('/:eventId/referees/:refereeId/attendant', (req, res) => {
  const { eventId, refereeId } = req.params
  const { attendant } = req.body

  console.log(`Attendant status updated for referee ${refereeId}: ${attendant}`)

  res.json({
    success: true,
    message: 'Attendant status updated'
  })
})

export default router
