import * as fs from 'fs'
import * as dotenv from 'dotenv'
import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import * as cookieParser from 'cookie-parser'
import * as helmet from 'helmet'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

import { AppModule } from './app.module'
import { setupSwagger } from './plugin/swagger'
import { TransformInterceptor } from './common/interceptors/response.interceptor'
import { HttpExceptionFilter } from './common/exceptions/http.exceptions'

interface IConfig {
  [key: string]: string | number | boolean
}

const envConfig: IConfig = dotenv.parse(fs.readFileSync(`${process.env.NODE_ENV || ''}.env`))
const APP_PORT = +(envConfig.NEST_PORT) || 8080
const API_PREFIX = envConfig.NEST_API_PREFIX as string

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.useGlobalPipes(new ValidationPipe())
  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalInterceptors(new TransformInterceptor())
  app.use(helmet())
  // app.setGlobalPrefix(API_PREFIX)

  // 处理跨域
  app.enableCors({
    origin: [/\.youmeng\.me$/, /\.youmeng\.me:.?[\d]{0,4}?$/, /localhost:.?[\d]{0,4}?$/],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
    optionsSuccessStatus: 204,
  })

  // setupSwagger(app)
  const options = new DocumentBuilder()
    .setTitle('问调调开发文档')
    .setDescription('https://api.wendiaodiao.com')
    .setVersion('1.0')
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('docs', app, document)
  app.use(cookieParser())

  await app.listen(APP_PORT).catch(e => {
    console.log(e)
  })
}

bootstrap().then(() => {
  console.log(`app successfully started open: http://localhost:${APP_PORT}`)
  console.log(`swagger successfully started open: http://localhost:${APP_PORT}/api`)
})
