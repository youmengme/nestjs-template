import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common'
import { ApiException } from './api.exceptions'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {

  catch(exception, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    // const request = ctx.getRequest()
    const status = exception.getStatus()
    const message = (exception.getResponse('message') || {}).message

    const retResult = (code = -1, errors = null) => response.status(status).json({
      data: null,
      msg: '请求出错',
      code,
      errors
    })
    if (exception instanceof ApiException) {
      retResult(exception.getErrorCode(), exception.getErrorMessage())
    } else {
      retResult(status, message)
    }
  }
}
