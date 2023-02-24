import { HttpStatus, Injectable } from '@nestjs/common'

import { ApiErrorService } from '@app/services/common/api-error.service'
import { QueryPaginationDto } from '@app/dto/common/pagination.dto'

import { EnvironmentConfigService } from '@app/services/common/environment-config.service'

export interface PaginationOptions {
  queryPaginationDto: QueryPaginationDto
  count: number
}

export interface BuildPaginationOptions {
  page: number
  take: number
  count: number
  pages: number
  prev: string | null
  next: string | null
}

export interface Presenter<Entity> {
  info: BuildPaginationOptions
  results: Entity[]
}

@Injectable()
export class PaginationService<Entity> {
  public constructor(private readonly config: EnvironmentConfigService, private readonly apiErrorService: ApiErrorService) {}

  private queryString(query: string | undefined, current: number, page: number, endpoint: string): string | null {
    if (!query) {
      return this.config.getBaseUrl() + '/api/' + endpoint + `?page=${page}`
    }
    return query.includes('page')
      ? this.config.getBaseUrl() + '/api/' + endpoint + query.replace(`page=${current}`, `?page=${page}`)
      : this.config.getBaseUrl() + '/api/' + endpoint + `?page=${page}&` + query
  }

  public buildPaginationInfo({ queryPaginationDto, count }: PaginationOptions): BuildPaginationOptions {
    const page = queryPaginationDto.page
    const endpoint = queryPaginationDto.endpoint
    const otherQuery = queryPaginationDto.otherQuery
    const take = queryPaginationDto.take
    const pages = Math.ceil(count / take)

    if (page > pages) {
      throw this.apiErrorService.throwErrorResponse('page', `Page ${page} does not exist`, HttpStatus.NOT_FOUND)
    }
    return {
      page,
      take,
      count,
      pages,
      prev: page - 1 ? this.queryString(otherQuery, page, page - 1, endpoint) : null,
      next: page < pages ? this.queryString(otherQuery, page, page + 1, endpoint) : null
    }
  }

  public wrapEntityWithPaginationInfo(results: Entity[], info: BuildPaginationOptions): Presenter<Entity> {
    return {
      info,
      results
    }
  }
}