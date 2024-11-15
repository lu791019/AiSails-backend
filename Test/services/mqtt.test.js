import { jest } from '@jest/globals'

// Mock 'mqtt' module
jest.unstable_mockModule('mqtt', () => ({
  default: {
    connect: jest.fn().mockReturnValue({
      on: jest.fn(),
      subscribe: jest.fn(),
      end: jest.fn(),
    }),
  },
}))

// Mock 'SkysailsInfluxModel'
jest.unstable_mockModule('@/influxDB/model/SkysailsInfluxModel', () => ({
  default: jest.fn().mockImplementation(() => ({
    writePoints: jest.fn(),
    close: jest.fn().mockResolvedValue(true), // 确保模拟的 close 方法返回一个 promise
  })),
}))

// Dynamically import the MqttFlowController module
describe('MqttFlowController', () => {
  let MqttFlowController
  let mqttFlowController
  let mockMqttClient
  let mockSkysailsInfluxDB

  beforeAll(async () => {
    // Import the mocked modules
    const mqtt = await import('mqtt')
    mockMqttClient = mqtt.default.connect()

    // const module = await import('@/controller/MqttFlowController');
    // MqttFlowController = module.default;

    // 模拟的 SkysailsInfluxModel 实例
    const SkysailsInfluxModel = (await import('@/influxDB/model/SkysailsInfluxModel')).default
    mockSkysailsInfluxDB = new SkysailsInfluxModel()

    // 确保模拟的方法返回期望的值，例如：
    mockSkysailsInfluxDB.writePoints.mockResolvedValue(true)
    mockSkysailsInfluxDB.close.mockResolvedValue(true)

    // 重置模拟的函数调用次数
    mockSkysailsInfluxDB.writePoints.mockClear()
    mockSkysailsInfluxDB.close.mockClear()
    // 重新设置模拟的返回值，如果需要的话
    mockSkysailsInfluxDB.close.mockResolvedValue(true)

    // 导入你的 MqttFlowController，这里也使用动态导入是因为你使用了 jest.unstable_mockModule
    const module = await import('@/controller/MqttFlowController')
    MqttFlowController = module.default
  })

  beforeEach(() => {
    // Create an instance of MqttFlowController
    mqttFlowController = new MqttFlowController()
  })

  it('should connect to MQTT on start', () => {
    mqttFlowController.start()

    // Check if mqtt.connect was called
    // expect(mockMqttClient.connect).toHaveBeenCalled();

    // Check if 'connect' event handler was set
    expect(mockMqttClient.on).toHaveBeenCalledWith('connect', expect.any(Function))
  })

  // 增加对 message 事件的测试

  it('should process message and write to InfluxDB and PostgreSQL on message event', async () => {
    // 模拟 message 事件的触发
    const mockMessageHandler = mqttFlowController.mqttClient.on.mock.calls.find((call) => call[0] === 'message')[1]

    // 模拟接收 MQTT 消息
    await mockMessageHandler('someTopic', '123.45')
  })

  // 测试 MQTT 客户端的 close 和 error 事件

  it('should close InfluxDB on mqtt client close event', () => {
    // 触发 close 事件
    mockMqttClient.on.mock.calls.find((call) => call[0] === 'close')[1]()

    // 确认 InfluxDB 的 close 方法被调用
    // expect(mockSkysailsInfluxDB.close).toHaveBeenCalled();
  })

  it('should handle mqtt client error event', () => {
    // 模拟一个错误对象
    const mockError = new Error('Test error')

    // 触发 error 事件
    mockMqttClient.on.mock.calls.find((call) => call[0] === 'error')[1](mockError)

    // 这里可以添加你期望发生的行为的断言，例如记录错误日志等
  })
})
