import app from '@/app'
import request from 'supertest'
import sequelize from '@/postgresqlDB/databases.js' // 確保從正確的路徑導入您的 Sequelize 實例

// const app = require("../../app")
describe('Sample Test', () => {
  it('should test that true === true', () => {
    expect(true).toBe(true)
  })
})

describe('POST /api/products', () => {
  beforeAll(async () => {
    // 这里同步数据库，确保所有模型都正确设置
    await sequelize.sync()
  })

  it('should create a product', async () => {
    const res = await request(app).post('/ess_cal/ess_status').send({
      name: 'Product 2',
      price: 1009,
      description: 'Description 2',
    })
    expect(res.statusCode).toBe(400)
  })

  afterAll(async () => {
    // 关闭 Sequelize 数据库连接
    await sequelize.close()
  })
})
