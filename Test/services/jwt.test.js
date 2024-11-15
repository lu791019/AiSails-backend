import app from '@/app'
import request from 'supertest'

describe('POST /api/products', () => {
  it('should create a product', async () => {
    const res = await request(app).post('/jwt').send({
      name: 'Product 2',
      price: 1009,
      description: 'Description 2',
    })
    expect(res.statusCode).toBe(200)
  })
})
