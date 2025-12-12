import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
// Go up one level from 'utils' to find 'db.json'
const dbPath = join(__dirname, '..', 'db.json')

export const getDb = () => {
    try {
        return JSON.parse(readFileSync(dbPath, 'utf-8'))
    } catch (error) {
        console.error('Error reading DB:', error)
        return { users: [], events: [], competitions: [], scores: [] }
    }
}

export const saveDb = (data) => {
    try {
        writeFileSync(dbPath, JSON.stringify(data, null, 2))
        return true
    } catch (error) {
        console.error('Error saving DB:', error)
        return false
    }
}
