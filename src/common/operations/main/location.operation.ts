import { HttpStatus, UseGuards } from '@nestjs/common'

import { Location } from '@infrastructure/entities/main'

import { MainEntitiesOperations } from '@common/operations'
import { HttpMethod } from '@common/constants'
import { JwtAuthGuard } from '@common/guards/authorization'
import { RolesGuard } from '@common/guards/common'
import { getPrivelegedRoles } from '@common/utils/getPrivelegedRoles'

export const LOCATION_OPERATION: MainEntitiesOperations = {
  CREATE: {
    summary: 'create and save a new location to collection',
    status: HttpStatus.CREATED,
    type: Location,
    method: HttpMethod.POST(''),
    role: getPrivelegedRoles(),
    guard: UseGuards(JwtAuthGuard, RolesGuard)
  },
  GET_MANY: {
    summary: 'get all locations by queries',
    status: HttpStatus.OK,
    type: [Location],
    method: HttpMethod.GET(''),
    guard: UseGuards(JwtAuthGuard)
  },
  GET_NAMES: {
    summary: 'get list of names',
    status: HttpStatus.OK,
    type: [String],
    method: HttpMethod.GET('/names'),
    guard: UseGuards(JwtAuthGuard)
  },
  GET_BY_FIELDS: {
    summary: 'get list of unique values by field',
    status: HttpStatus.OK,
    type: [String],
    method: HttpMethod.GET('/unique'),
    guard: UseGuards(JwtAuthGuard)
  },
  GET_ONE: {
    summary: 'get one location with specified id',
    status: HttpStatus.OK,
    type: Location,
    method: HttpMethod.GET(':id'),
    guard: UseGuards(JwtAuthGuard)
  },
  GET_COUNT: {
    summary: 'get count of locations',
    status: HttpStatus.OK,
    type: Number,
    method: HttpMethod.GET('/count'),
    guard: UseGuards()
  },
  UPDATE: {
    summary: 'update one location with specified id',
    status: HttpStatus.OK,
    type: Location,
    method: HttpMethod.PATCH(':id'),
    role: getPrivelegedRoles(),
    guard: UseGuards(JwtAuthGuard, RolesGuard)
  },
  REMOVE: {
    summary: 'remove one location with specified id',
    status: HttpStatus.OK,
    type: Location,
    method: HttpMethod.DELETE(':id'),
    role: getPrivelegedRoles(),
    guard: UseGuards(JwtAuthGuard, RolesGuard)
  }
}
