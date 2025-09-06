import { expect } from 'chai'
import { initializeTestDb, insertTestUser, getToken } from './helper/test.js'

const BASE = 'http://localhost:3002'

describe('Testing user management', () => {
  before(async () => {
    await initializeTestDb() 
  })

  it('should sign up', async () => {
    const newUser = { email: 'foo@test.com', password: 'password123' }
    const res = await fetch(`${BASE}/user/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: newUser })
    })
    const data = await res.json()
    if (res.status !== 201) {
      console.error('Signup server error:', data?.error || data)
    }
    expect(res.status).to.equal(201)
    expect(data).to.include.all.keys(['id', 'email'])
    expect(data.email).to.equal(newUser.email)
  })

  it('should log in', async () => {
    
    const u = { email: 'foo2@test.com', password: 'password123' }
    await insertTestUser(u.email, u.password)

    const res = await fetch(`${BASE}/user/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: u })
    })
    const data = await res.json()
    expect(res.status).to.equal(200)
    expect(data).to.include.all.keys(['id', 'email', 'token'])
    expect(data.email).to.equal(u.email)
  })
})

describe('Testing basic database functionality (with auth)', () => {
  let token = null

  before(async () => {
    await initializeTestDb()
    
    token = getToken('foo@foo.com')
  })

  it('should get all tasks', async () => {
    const res = await fetch(`${BASE}/`)
    const data = await res.json()
    expect(res.status).to.equal(200)
    expect(data).to.be.an('array').that.is.not.empty
    expect(data[0]).to.include.all.keys(['id', 'description'])
  })

  it('should create a new task (auth required)', async () => {
    const newTask = { description: 'Test task' }
    const res = await fetch(`${BASE}/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ task: newTask })
    })
    const data = await res.json()
    expect(res.status).to.equal(201)
    expect(data).to.include.all.keys(['id', 'description'])
    expect(data.description).to.equal(newTask.description)
  })

  it('should delete a task (auth required)', async () => {
  
    const create = await fetch(`${BASE}/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token   
      },
      body: JSON.stringify({ task: { description: 'To delete' } })
    })
    const created = await create.json()

    const del = await fetch(`${BASE}/delete/${created.id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    expect([200, 404]).to.include(del.status)
    const payload = await del.json()
    expect(payload).to.have.property('id')
  })
})
