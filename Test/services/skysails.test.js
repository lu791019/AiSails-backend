import sequelize from '@/postgresqlDB/databases.js' // 確保從正確的路徑導入您的 Sequelize 實例

import SkysailsController from '@/controller/SkysailsController.js'

describe('POST /api/products', () => {
  beforeAll(async () => {
    // 这里同步数据库，确保所有模型都正确设置
    await sequelize.sync()
  })

  it('should create a product', async () => {
    await SkysailsController.deleteSkysails()
  })

  afterAll(async () => {
    // 关闭 Sequelize 数据库连接
    await sequelize.close()
  })
})
