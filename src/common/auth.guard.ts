import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { ERRORS } from './errors.constant'

/**
 * 用于需要登录的接口（即需要 `userId` 参数的控制器方法）
 *
 * 校验条件：
 * 1. `request` 对象挂载 `user` 对象
 * 2. `user` 对象的 `id` 值大于 0
 */
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()

    if (request.user && request.user.id > 0) {
      return true
    } else {
      throw new HttpException(ERRORS.UNAUTHORIZED_ACCESS, HttpStatus.UNAUTHORIZED)
    }
  }
}
