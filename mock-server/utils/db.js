import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
// Go up one level from 'utils' to find 'db.json'
const dbPath = join(__dirname, '..', 'db.json')

// Load initial data from file (read-only in serverless)
let initialData = null
try {
    initialData = JSON.parse(readFileSync(dbPath, 'utf-8'))
} catch (error) {
    console.error('Error loading initial DB:', error)
    initialData = { users: [], events: [], competitions: [], scores: [] }
}

// In-memory storage for serverless environment
let dbCache = JSON.parse(JSON.stringify(initialData))

export const getDb = () => {
    // Return a fresh copy of the data
    return JSON.parse(JSON.stringify(dbCache))
}

export const saveDb = (data) => {
    // Save to in-memory cache (persists only during function lifetime)
    dbCache = JSON.parse(JSON.stringify(data))
    return true
}
