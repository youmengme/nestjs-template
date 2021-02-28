import OSS from 'ali-oss'
import { ConfigService } from './config'
const options = {
  endpoint: ConfigService.getConfig('OSS_CLIENT_ENDPOINT'), // endpoint域名
  accessKeyId: ConfigService.getConfig('OSS_CLIENT_ACCESS_KEY'), // 账号
  accessKeySecret: ConfigService.getConfig('OSS_CLIENT_ACCESS_SECRET'), // 密码
  bucket: ConfigService.getConfig('OSS_CLIENT_BUCKET'), // 存储桶
  internal: ConfigService.getConfig('OSS_CLIENT_INTERNAL'), // 是否使用阿里云内部网访问
  secure: ConfigService.getConfig('OSS_CLIENT_SECURE'), // 使用 HTTPS
  cname: ConfigService.getConfig('OSS_CLIENT_CNAME'), // 自定义endpoint
  timeout: ConfigService.getConfig('OSS_CLIENT_TIMEOUT')
}
const OssClient = new OSS(options)

// 上传文件
export const uploadFileToOSS = async (path, buffer: Buffer | string) => {
  return await OssClient.put(path, Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer))
}

// 下载文件
export const downloadFileFromOSS = async (path) => {
  return OssClient.get(path)
}
