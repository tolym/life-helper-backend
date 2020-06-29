'use strict'

/**
 * 与微信服务端权限相关的方法放在本文件中
 */



const axios = require('axios')
const Redis = require('ioredis')

const { MINIPROGRAM_MAIN_DEVELOPER_ID, REDIS_MAIN } = require('../config/config.global')



/**
 * 从微信服务器获取 access_token， 用于我方服务端和微信服务端之间交互
 * 
 * 微信API地址：https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/access-token/auth.getAccessToken.html
 * 
 * @returns {Promise} resolve({access_token: 'xxxxxxxx', expires_in: 7200})
 */
function fetchAccessTokenFromWXServer() {
	return new Promise(async function (resolve, reject) {
		const response = await axios({
			method: 'GET',
			url: 'https://api.weixin.qq.com/cgi-bin/token',
			params: {
				grant_type: 'client_credential',
				appid: MINIPROGRAM_MAIN_DEVELOPER_ID.appid,
				secret: MINIPROGRAM_MAIN_DEVELOPER_ID.secret
			}
		})

		if (response.data.errcode) {
			reject(new Error('微信服务端报错，错误信息：' + response.data.errmsg))
		} else {
			resolve(response.data)
		}
	})
}



/**
 * 更新 Redis 中的微信服务端接口调用凭据 access_token 
 * 
 * 备注：
 *   1. 无论该键值是否存在或者过期，均强制更新
 *   2. 微信服务端接口调用凭据 access_token 在 Redis 中键名为 [ WXServerAccessToken ]
 *   3. 方法中调用内部函数  [ fetchAccessTokenFromWXServer ]
 * 
 * @returns {Promise} resolve(WXServerAccessToken: string)
 * 
 */
function updateWXAccessTokenInRedis() {
	return new Promise(async function (resolve, reject) {
		const TokenWrapper = await fetchAccessTokenFromWXServer()

		const WXServerAccessToken = TokenWrapper.access_token
		const expireTime = TokenWrapper.expires_in

		// 创建 Redis 实例
		const redis = new Redis(REDIS_MAIN)

		await redis.set('WXServerAccessToken', WXServerAccessToken)
		await redis.expire('WXServerAccessToken', expireTime)

		// 断开 redis 连接
		await redis.quit()

		resolve(WXServerAccessToken)
	})
}



/**
 * 用于内部调用获取微信服务端接口调用凭据 access_token (在 Redis 中键名为 [ WXServerAccessToken ])
 * 
 * @returns {Promise} resolve(WXServerAccessToken: string)
 */
function getWXAccessToken() {
	return new Promise(async function (resolve, reject) {

		// 创建 Redis 实例
		const redis = new Redis(REDIS_MAIN)

		let WXServerAccessToken = await redis.get('WXServerAccessToken')
		if (!WXServerAccessToken) {
			WXServerAccessToken = await updateWXAccessTokenInRedis()
		}

		// 断开 redis 连接
		await redis.quit()

		resolve(WXServerAccessToken)
	})
}



module.exports = {
	fetchAccessTokenFromWXServer,
	updateWXAccessTokenInRedis,
	getWXAccessToken
}