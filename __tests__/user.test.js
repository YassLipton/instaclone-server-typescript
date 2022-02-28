const mongoose = require('mongoose')
const request = require('supertest')
const app = require('../server')

beforeAll(async () => {
  const dbURI = 'mongodb+srv://yass:pass1234@buildercluster.fqwqx.mongodb.net/insta?retryWrites=true&w=majority'
  await mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
})

describe('Login', () => {
  it('should login successfully', async () => {
    const res = await request(app)
      .post('/user/login') 
      .send({
        username: 'johndoe',
        password: 'dodo',
      })
      const { successfullyLogged } = res.body
    expect(res.statusCode).toEqual(200)
    expect(successfullyLogged).toBe(true)
  })
  it('should fail login', async () => {
    const res = await request(app)
      .post('/user/login') 
      .send({
        username: 'johndoe',
        password: 'dod',
      })
      const { successfullyLogged } = res.body
    expect(res.statusCode).toEqual(401)
    expect(successfullyLogged).toBe(false)
  })
})

afterAll((done) => {
  mongoose.disconnect()
  done()
})