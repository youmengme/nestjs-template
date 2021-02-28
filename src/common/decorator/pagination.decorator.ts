import { createParamDecorator, ExecutionContext } from '@nestjs/common'

import { IsInt } from 'class-validator'
import { isObject } from '../../utils'

interface IPaginationDto {
  offset: number
  limit: number
}

export class PaginationDto implements IPaginationDto {
  @IsInt()
  offset: number

  @IsInt()
  limit: number
}

interface ILimit {
  min: number
  max: number
}

interface IDataInterface {
  limit: number | ILimit,
  sort: string[]
}

export interface IPagination<T> {
  limit: number
  offset: number
  order?: T
}

export const Pagination = createParamDecorator((options: IDataInterface | undefined, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()
  const defaultOptions: IDataInterface = {
    limit: {
      min: 1,
      max: 100
    },
    sort: ['id', 'createdAt']
  }
  const data = options ? options : defaultOptions

  const defaultData: Record<string, any> = {
    limit: 20,
    offset: 0
  }

  if (!request || !request.query || !data) return defaultData
  let { sort, limit } = data
  if (!limit) limit = 100
  if (!sort) sort = ['id', 'createdAt']
  const { page = 0, sort_by, size = 20, order } = request.query

  // offset
  if (page) defaultData.offset = page * size

  // limit
  // 如果设置了limit且limit是个数字, 大于单页数量用limit，否则用size
  if (typeof limit === 'number') defaultData.limit = (+size) <= limit ? +size : limit
  if (isObject(limit)) {
    const { min = 1, max = 100 } = limit as ILimit
    defaultData.limit = (+size) >= max ? max : ((+size) <= min ? min : (+size))
  }

  // sort
  if (sort_by && sort.includes(sort_by)) {
    const orde = order.toUpperCase()
    defaultData.order = [
      [sort_by, ['ASC', 'DESC'].includes(orde) ? orde : 'DESC']
    ]
  } else {
    defaultData.order = [
      ['createdAt', 'DESC']
    ]
  }

  return defaultData
})
