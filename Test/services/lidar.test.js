import { jest } from '@jest/globals'

// Jest 测试文件
// 使用 jest.unstable_mockModule 来模拟外部依赖
beforeAll(() => {
  jest.unstable_mockModule('promise-ftp', () => ({
    default: jest.fn().mockImplementation(() => ({
      connect: jest.fn().mockResolvedValue('服务器响应消息'),
      get: jest.fn().mockResolvedValue({
        once: (event, handler) => {
          if (event === 'close') handler()
        },
        pipe: jest.fn(),
      }),
      end: jest.fn().mockResolvedValue(''),
    })),
  }))

  jest.unstable_mockModule('util', () => ({
    promisify: jest.fn().mockReturnValue(
      jest.fn().mockImplementation((execCallback) => {
        // 模拟 execCallback 被调用时的行为
        if (execCallback.includes('docker run -v /var/www/public:/app sony791210/wind-zph-csv')) {
          return Promise.resolve({ stdout: 'Docker command executed successfully', stderr: '' })
        }
        return Promise.reject(new Error('Command failed'))
      }),
    ),
  }))
})

// import  LidarController  from '@/controller/LidarController.js'
// 动态导入被测试的模块
describe('ftpDownload 函数测试', () => {
  it('应该成功连接到FTP并下载文件', async () => {
    const LidarController = await import('@/controller/LidarController.js')
    await LidarController.default.ftpDownload()
  })

  it('应该正确执行 Docker 命令', async () => {
    // 动态导入你的模块，确保 jest.unstable_mockModule 应用于该模块
    const LidarController = await import('@/controller/LidarController.js')
    // 调用 convertToCsv 并断言期望的结果
    await expect(LidarController.default.converToCsv()).resolves.toEqual(undefined) // 根据实际返回值调整断言
    // 这里你还可以添加更多的断言，比如检查 console.log 或 console.error 是否被正确调用
  })
})
