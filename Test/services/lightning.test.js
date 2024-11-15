import LightningController from '@/controller/LightningController.js'

import { jest } from '@jest/globals'

beforeAll(() => {
  jest.unstable_mockModule('@/postgresqlDB/model/LightningPostgreModel.js', () => ({
    max: jest.fn().mockResolvedValue('2023-12-31T23:59:59Z'),
    findOne: jest.fn().mockResolvedValue(null),
    create: jest.fn().mockResolvedValue(true),
  }))
})

describe('POST /api/products', () => {
  it('should create a product', async () => {
    await LightningController.currentLightning()
  })
})
