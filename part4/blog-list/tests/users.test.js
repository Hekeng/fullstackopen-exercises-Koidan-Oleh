const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

const initialUser = {
  username: 'mluukkai',
  name: 'Matti Luukkainen',
  password: 'salainen',
}

describe('user creation', () => {
  beforeEach(async () => {
    await User.deleteMany({})
  })

  test('user with a short username is not created', async () => {
    const newUser = { ...initialUser, username: 'ab' }

    const response = await api.post('/api/users').send(newUser).expect(400)

    assert.strictEqual(typeof response.body.error, 'string')

    const users = await User.find({})
    assert.strictEqual(users.length, 0)
  })

  test('user without username is not created', async () => {
    const newUser = { name: 'Matti', password: 'salainen' }

    const response = await api.post('/api/users').send(newUser).expect(400)

    assert.strictEqual(typeof response.body.error, 'string')

    const users = await User.find({})
    assert.strictEqual(users.length, 0)
  })

  test('user with a short password is not created', async () => {
    const newUser = { ...initialUser, password: 'ab' }

    const response = await api.post('/api/users').send(newUser).expect(400)

    assert.strictEqual(typeof response.body.error, 'string')

    const users = await User.find({})
    assert.strictEqual(users.length, 0)
  })

  test('user without password is not created', async () => {
    const newUser = { username: 'mluukkai', name: 'Matti' }

    const response = await api.post('/api/users').send(newUser).expect(400)

    assert.strictEqual(typeof response.body.error, 'string')

    const users = await User.find({})
    assert.strictEqual(users.length, 0)
  })

  test('user with an existing username is not created', async () => {
    await api.post('/api/users').send(initialUser).expect(201)

    const response = await api.post('/api/users').send(initialUser).expect(400)

    assert.strictEqual(typeof response.body.error, 'string')

    const users = await User.find({})
    assert.strictEqual(users.length, 1)
  })
})

after(async () => {
  await mongoose.connection.close()
})
