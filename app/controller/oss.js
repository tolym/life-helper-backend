'use strict'

const { Controller } = require('egg')

/**
 * 当前控制器放置 OSS 相关服务
 */

class OssController extends Controller {
  /**
   * @api {get} /oss/token 获取 OSS 直传凭证
   * @apiName token
   * @apiGroup oss
   * @apiVersion v1
   */
  async token() {
    const { ctx, service, config } = this
    const { n } = ctx.query
    const num = parseInt(n, 10) || 1
    if (num >= 1 && num <= 10) {
      const list = []
      for (let i = 0; i < num; i++) {
        list.push(service.oss.generateClientToken())
      }
      ctx.body = { list, url: config.domain.ossImageUgc }
    }
  }
}

module.exports = OssController
