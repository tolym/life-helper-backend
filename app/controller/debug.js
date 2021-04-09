'use strict'

const { Controller } = require('egg')

class DebugController extends Controller {
  /**
   * @api {all} /debug ALL /debug
   * @apiName index
   * @apiGroup debug
   * @apiVersion 0.0.1
   * @apiDescription 原样返回请求信息，用于调试请求
   */
  async index() {
    const { ctx, service } = this
    ctx.body = service.debug.getRequestDetail()
  }

  /**
   * @api {all} /debug/auth ALL /debug/auth
   * @apiName auth
   * @apiGroup debug
   * @apiVersion 0.9.8
   * @apiDescription 内部调试接口，用于调试获取 code, token, userId 等参数
   */
  async auth() {
    const { ctx } = this
    ctx.body = ctx.state.auth
  }

  /**
   * @api {get} /request/:id GET /request/:id
   * @apiName request
   * @apiGroup debug
   * @apiVersion 0.9.5
   * @apiDescription 查看请求日志
   */
  async request() {
    const { app, ctx } = this
    const { id } = ctx.params
    if (!id) {
      ctx.body = {}
      return
    }
    const oss = app.oss.get('dataflow')
    const data = await oss.get('/request-log/' + id + '.json')
    ctx.body = data.content.toString()
  }

  async throwError() {
    const { ctx } = this
    const queryRule = {
      t: { required: true, type: 'enum', values: ['one', 'two', 'three'] },
    }
    ctx.validate(queryRule, ctx.query)
    const { t } = ctx.query
    if (t === 'one') {
      ctx.throw(401, 'i am message')
    } else if (t === 'two') {
      ctx.throw(402, 'abcasdf', {
        name: 'mark',
        age: 19,
      })
    }
  }

  /**
   * @api {all} /debug/temp ALL /debug/temp
   * @apiName temp
   * @apiGroup debug
   * @apiVersion 0.9.5
   * @apiDescription 用于临时测试
   */
  async temp() {
    const { ctx } = this

    ctx.body = 'hello'
  }
}

module.exports = DebugController
