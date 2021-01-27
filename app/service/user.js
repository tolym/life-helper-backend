'use strict'

const { Service } = require('egg')

/** 当返回用户ID为 0 时，表示该用户不存在 */
const NOT_EXIST_USER_ID = 0

class UserService extends Service {
  /**
   * 通过 openid 从用户（user）表中查找用户 ID，如果未找到则返回 0
   * @param {string} openid
   * @returns {Promise<number>} userId
   */
  async getUserIdByOpenid(openid) {
    const { app, logger } = this

    const result = await app.model.User.findOne({
      where: {
        openid,
      },
    })

    if (!result) {
      logger.debug(
        `通过openid从用户表中查询获取userId -> openid => ${openid} 在用户表中未找到，为新用户`
      )
      return NOT_EXIST_USER_ID
    } else {
      logger.debug(
        `通过openid从用户表中查询获取userId -> openid => ${openid} / userId => ${result.id}`
      )
      return result.id
    }
  }

  /**
   * 在判断 openid 不存在的情况下，创建新用户，并返回用户 id
   * @param {!string} openid
   * @returns {Promise<number>} 新用户的 userId
   */
  async createNewUser(openid) {
    if (!openid || typeof openid !== 'string') {
      throw new Error('参数错误: openid为空或非字符串')
    }

    const { app, logger } = this

    const row = {
      openid,
    }

    const result = await app.model.User.create(row)
    logger.info(`创建新用户 - userId => ${result.id}`)
    return result.id
  }

  /**
   * 通过小程序传递的 code 获取 userId
   * 1. 包含了创建新用户操作
   * @param {!string} code
   * @returns {Promise<number>}
   */
  async getUserIdByCode(code) {
    const { service } = this

    const openid = await service.mp.code2Openid(code)
    let userId = await this.getUserIdByOpenid(openid)

    if (userId === NOT_EXIST_USER_ID) {
      userId = await this.createNewUser(openid)
    }

    return userId
  }

  /**
   * 更新用户资料（从小程序授权获取的用户信息）
   * @param {object} userInfo 用户资料
   * @param {string} userInfo.avatarUrl 用户头像图片的 URL
   * @param {string} userInfo.city 用户所在城市
   * @param {string} userInfo.country 用户所在国家
   * @param {number} userInfo.gender 用户性别：0-未知，1-男性，2-女性
   * @param {string} userInfo.language 显示 country，province，city 所用的语言：'en'-英文，'zh_CN'-简体中文	，'zh_TW'-繁体中文
   * @param {string} userInfo.nickName 用户昵称
   * @param {string} userInfo.province 用户所在省份
   */
  async updateUserInfo(userInfo) {
    const { ctx } = this

    const { avatarUrl: avatar_url, city, country, gender, nickName: nickname, province } = userInfo

    const result = await ctx.model.User.update(
      {
        avatar_url,
        city,
        country,
        gender,
        nickname,
        province,
      },
      {
        where: {
          id: ctx.userId,
        },
      }
    )

    return result
  }

  /**
   * 获取指定用户的个人信息（昵称、头像、性别）
   * @param {?number} userId 用户 id
   * @returns {Promise<{nickname:string;avatar_url:string;gender:number;}>}
   */
  async getUserInfo(userId) {
    const { ctx } = this
    userId = userId || ctx.userId

    const result = await ctx.model.User.findByPk(userId, {
      attributes: ['nickname', 'avatar_url', 'gender'],
    })

    return result
  }
}

module.exports = UserService
