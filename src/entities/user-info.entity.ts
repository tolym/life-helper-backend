import { Entity, Column } from 'typeorm'
import { BaseEntity } from './base.entity'

/**
 * 用户信息表
 */
@Entity()
export class UserInfo extends BaseEntity {
  @Column({
    name: 'nick_name',
    type: 'varchar',
    length: 32,
    default: '',
    comment: '微信用户昵称',
  })
  nickName: string

  @Column({
    name: 'avatar_url',
    type: 'varchar',
    length: 256,
    default: '',
    comment: '微信头像的 URL',
  })
  avatarUrl: string

  @Column({
    type: 'tinyint',
    default: -1,
    comment: '性别，0-未知，1-男性，2-女性',
  })
  gender: string

  @Column({
    type: 'varchar',
    length: 64,
    default: '',
    comment: '用户所在国家',
  })
  country: string

  @Column({
    type: 'varchar',
    length: 64,
    default: '',
    comment: '用户所在省份',
  })
  province: string

  @Column({
    type: 'varchar',
    length: 64,
    default: '',
    comment: '用户所在城市',
  })
  city: string
}