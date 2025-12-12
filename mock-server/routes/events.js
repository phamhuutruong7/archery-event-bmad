import express from 'express'
import { getDb, saveDb } from '../utils/db.js'

const router = express.Router()

// Get all events
router.get('/', (req, res) => {
    const db = getDb()
    const { status, search, page = 1, pageSize = 10 } = req.query

    let events = db.events
    if (status) events = events.filter(e => e.status === status)
    if (search) events = events.filter(e => e.name.toLowerCase().includes(search.toLowerCase()))

    const start = (page - 1) * pageSize
    const paginatedEvents = events.slice(start, start + parseInt(pageSize))

    res.json({
        events: paginatedEvents,
        total: events.length,
        page: parseInt(page),
        pageSize: parseInt(pageSize)
    })
})

// Get my events
router.get('/my-events', (req, res) => {
    const authHeader = req.headers.authorization
    let userId = 'user-001'
    if (authHeader && authHeader.startsWith('Bearer mock-token-')) {
        userId = authHeader.replace('Bearer mock-token-', '')
    }

    const db = getDb()
    const myEvents = db.events.filter(e => e.hostUserId === userId)
    res.json({ events: myEvents, total: myEvents.length })
})

// Get competitions for an event (MUST come before /:id route)
router.get('/:eventId/competitions', (req, res) => {
    const db = getDb()
    const competitions = db.competitions.filter(c => c.eventId === req.params.eventId)

    setTimeout(() => {
        res.json(competitions)
    }, 100) // Simulate network delay
})

// Get event by ID
router.get('/:id', (req, res) => {
    const db = getDb()
    const event = db.events.find(e => e.id === req.params.id)

    if (event) {
        // Enrich event with competitions
        const competitions = db.competitions.filter(c => c.eventId === event.id)

        // Enrich with organizer info (host)
        const host = db.users.find(u => u.id === event.hostUserId)
        const organizer = host ? {
            name: `${host.firstName} ${host.lastName}`,
            email: host.email,
            phone: host.phoneNumber
        } : {
            name: "Unknown Organizer",
            email: "contact@event.com",
            phone: ""
        }

        const enhancedEvent = {
            ...event,
            title: event.name, // Frontend expects title, db has name. Mapping both for safety.
            dateDisplay: `${new Date(event.startDate).toLocaleDateString()} - ${new Date(event.endDate).toLocaleDateString()}`,
            competitions: competitions.map(c => ({
                ...c,
                // Ensure fields match what frontend expects if they differ
                // Frontend 'Competition' interface: id, bowType, category, round, subround
                // DB has these mostly.
                round: c.format || 'Standard', // DB uses 'format', frontend expects 'round'
                subround: c.distance || ''     // DB uses 'distance', frontend expects 'subround' mostly
            })),
            organizer
        }

        res.json(enhancedEvent)
    } else {
        res.status(404).json({ error: 'Event not found' })
    }
})

// Create event
router.post('/', (req, res) => {
    const db = getDb()
    const authHeader = req.headers.authorization
    let userId = 'user-001'
    if (authHeader && authHeader.startsWith('Bearer mock-token-')) {
        userId = authHeader.replace('Bearer mock-token-', '')
    }

    const newEvent = {
        id: `event-${Date.now()}`,
        ...req.body,
        hostUserId: userId,
        status: 'Draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }

    db.events.push(newEvent)
    saveDb(db)
    res.status(201).json(newEvent)
})

// Update event
router.put('/:id', (req, res) => {
    const db = getDb()
    const index = db.events.findIndex(e => e.id === req.params.id)

    if (index === -1) {
        return res.status(404).json({ error: 'Event not found' })
    }

    db.events[index] = {
        ...db.events[index],
        ...req.body,
        updatedAt: new Date().toISOString()
    }

    saveDb(db)
    res.json(db.events[index])
})

// Delete event
router.delete('/:id', (req, res) => {
    const db = getDb()
    const index = db.events.findIndex(e => e.id === req.params.id)

    if (index === -1) {
        return res.status(404).json({ error: 'Event not found' })
    }

    db.events.splice(index, 1)
    saveDb(db)
    res.sendStatus(204)
})

export default router
