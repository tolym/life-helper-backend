import { IsString, IsNumber, IsNotEmpty, Max, Min } from 'class-validator'
import { Expose } from 'class-transformer'

/**
 * 小程序调用 `wx.chooseLocation` 获取的数据
 */
export class WxChooseLocationResult {
  @IsString()
  @IsNotEmpty()
  /** 位置名称 */
  name: string

  @IsString()
  @IsNotEmpty()
  /** 详细地址 */
  address: string

  @IsNumber()
  @Min(-90)
  @Max(90)
  /** 纬度，浮点数，范围为-90~90，负数表示南纬。使用 gcj02 国测局坐标系 */
  latitude: number

  @IsNumber()
  @Min(-180)
  @Max(180)
  /** 经度，浮点数，范围为-180~180，负数表示西经。使用 gcj02 国测局坐标系 */
  longitude: number
}

/**
 * 实时天气方法返回内容
 * Weather#getWeatherNow
 */
export class WeatherNow {
  obsTime: string

  @Expose()
  temp: string
  feelsLike

  @Expose()
  icon: string

  @Expose()
  text: string

  @Expose()
  wind360: string

  @Expose()
  windDir: string

  @Expose()
  windScale: string

  @Expose()
  windSpeed: string

  @Expose()
  humidity: string

  @Expose()
  precip: string

  @Expose()
  pressure: string

  @Expose()
  vis: string

  cloud: string
  dew: string
}

export class MinutelyRain {
  @Expose()
  summary: string

  @Expose()
  minutely: any[]
}
