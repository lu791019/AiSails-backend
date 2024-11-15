import WeatherController from '@/controller/WeatherController.js'
import { jest } from '@jest/globals'

beforeAll(() => {
  jest.unstable_mockModule('@/postgresqlDB/model/weatherInfoPostgreModel.js', () => ({
    max: jest.fn().mockResolvedValue('2023-12-31T00:00:00Z'),
    bulkCreate: jest.fn().mockResolvedValue(true),
  }))

  jest.unstable_mockModule('@/postgresqlDB/model/weatherRiskInfoPostgreModel.js', () => ({
    upsert: jest.fn().mockResolvedValue(true),
  }))
})

describe('cwbDataGetWeather', () => {
  it('should create a product', async () => {
    await WeatherController.cwbDataGetWeather()
  })
})

describe('weatherriskDataGetWeather ', () => {
  it('should create a product', async () => {
    await WeatherController.weatherriskDataGetWeather()
  })
})
