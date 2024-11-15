import { jest } from '@jest/globals'

// Mock '@influxdata/influxdb-client' module
jest.unstable_mockModule('@influxdata/influxdb-client', () => ({
  InfluxDB: jest.fn().mockImplementation(() => ({
    getWriteApi: jest.fn().mockReturnValue({
      writePoint: jest.fn(),
      close: jest.fn().mockResolvedValue(true),
    }),
  })),
  Point: jest.fn().mockImplementation(() => ({
    tag: jest.fn(),
    floatField: jest.fn(),
    intField: jest.fn(),
    stringField: jest.fn(),
    booleanField: jest.fn(),
  })),
}))

// Dynamically import the SkysailsInfluxModel module after mocking dependencies
describe('SkysailsInfluxModel Integration Test', () => {
  let SkysailsInfluxModel
  let influxModel

  beforeAll(async () => {
    // Import the mocked module
    const module = await import('@/influxDB/model/SkysailsInfluxModel')
    SkysailsInfluxModel = module.default
  })

  beforeEach(() => {
    // Create an instance of SkysailsInfluxModel
    influxModel = new SkysailsInfluxModel()
  })

  it('should correctly set up InfluxDB client and schema', () => {
    expect(influxModel.measurement).toBe('skysails')
    expect(influxModel.influxDBSchema).toEqual({
      measurement: 'skysails',
      tags: ['productName'],
      fields: expect.any(Object),
    })
  })

  it('should prepare and send data to InfluxDB', async () => {
    const mockTag = { productName: 'TestProduct' }
    const mockData = { Power_Chopper1_kW: 123.45 }

    await influxModel.save(mockTag, mockData)

    // Since we're mocking, we validate the interaction with mocks
    // Verify if writePoint was called on the writeApi
    expect(influxModel.writeApi.writePoint).toHaveBeenCalled()
    // You can add more detailed assertions here based on your logic
  })

  // Add more test cases as needed
})
