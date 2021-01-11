'use strict'

const { Service } = require('egg')

/** 系统相关服务 */
class SystemService extends Service {
  /** 查看系统运行状态信息 */
  async status() {
    const {
      /** 操作系统的 CPU 架构 */
      arch,

      /** 调试器使用的端口 */
      debugPort,

      /** 进程的 PID */
      pid,

      /** 当前进程的父进程的 PID */
      ppid,

      /** 操作系统平台 */
      platform,

      /** Node.js 版本字符串,例如 v14.8.0 */
      version,
    } = process

    const {
      /** 应用名称 */
      name,

      /** env 环境 */
      env,

      /** 应用代码的目录 */
      baseDir,
    } = this.app.config

    /** 监听端口 */
    const listenPort = this.app.config.cluster.listen.port

    return {
      arch,
      debugPort,
      pid,
      ppid,
      platform,
      version,
      name,
      env,
      baseDir,
      listenPort,
    }
  }
}

module.exports = SystemService