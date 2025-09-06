import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { pool } from './db.js'
import jwt from 'jsonwebtoken'
import { hash } from 'bcrypt' 

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const initializeTestDb = () => {
  const sqlPath = path.resolve(__dirname, '../db.sql')
  const sql = fs.readFileSync(sqlPath, 'utf8')
  return new Promise((resolve, reject) => {
    pool.query(sql, (err) => {
      if (err) {
        console.error('Error initializing test database:', err)
        return reject(err)
      }
      console.log('Test database initialized successfully')
      resolve()
    })
  })
}

export const insertTestUser = (email, password) => {
  return new Promise((resolve, reject) => {
    hash(password, 10, (err, hp) => {
      if (err) return reject(err)
      pool.query('INSERT INTO account (email, password) VALUES ($1, $2)', [email, hp],
        (err2) => {
          if (err2) return reject(err2)
          resolve()
        })
    })
  })
}

export const getToken = (email) => {
  return jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '2h' })
}
