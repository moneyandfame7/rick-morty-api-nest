import { HttpStatus, UseGuards } from '@nestjs/common'

import { User } from '@infrastructure/entities/common'

import { HttpMethod, ROLES } from '@common/constants'
import { Roles } from '@common/decorators'
import { JwtAuthGuard } from '@common/guards/authorization'
import { RolesGuard } from '@common/guards/common'
import { BaseOperationOptions, BaseOperations } from '@common/swagger/interface'

interface IUserOperation {
  ADD_ROLE: BaseOperationOptions
  BAN: BaseOperationOptions
  CHANGE_IMAGE: BaseOperationOptions
}

type UserOperation = IUserOperation & BaseOperations
export const USER_OPERATION: UserOperation = {
  CREATE: {
    summary: 'create and save a new user to collection',
    status: HttpStatus.CREATED,
    type: User,
    method: HttpMethod.POST(''),
    role: Roles(ROLES.ADMIN),
    guard: UseGuards(JwtAuthGuard, RolesGuard)
  },
  GET_MANY: {
    summary: 'get all users',
    status: HttpStatus.OK,
    type: [User],
    method: HttpMethod.GET(''),
    guard: UseGuards(JwtAuthGuard)
  },
  GET_ONE: {
    summary: 'get one user with specified id',
    status: HttpStatus.OK,
    type: User,
    method: HttpMethod.GET(':id'),
    guard: UseGuards(JwtAuthGuard)
  },
  UPDATE: {
    summary: 'update one user with specified id',
    status: HttpStatus.OK,
    type: User,
    method: HttpMethod.PATCH(':id'),
    role: Roles(ROLES.ADMIN),
    guard: UseGuards(JwtAuthGuard, RolesGuard)
  },
  REMOVE: {
    summary: 'remove one user with specified id',
    status: HttpStatus.OK,
    type: User,
    method: HttpMethod.DELETE(':id'),
    role: Roles(ROLES.ADMIN, ROLES.USER),
    guard: UseGuards(JwtAuthGuard, RolesGuard)
  },
  ADD_ROLE: {
    summary: 'give a role to user',
    status: HttpStatus.OK,
    type: User,
    method: HttpMethod.POST('/role'),
    role: Roles(ROLES.ADMIN),
    guard: UseGuards(JwtAuthGuard, RolesGuard)
  },
  BAN: {
    summary: ' ban a user',
    status: HttpStatus.OK,
    type: User,
    method: HttpMethod.POST('/ban'),
    role: Roles(ROLES.ADMIN),
    guard: UseGuards(JwtAuthGuard, RolesGuard)
  },
  CHANGE_IMAGE: {
    summary: 'change user image',
    status: HttpStatus.OK,
    type: User,
    method: HttpMethod.POST(':id/photo'),
    guard: UseGuards(JwtAuthGuard)
  }
}
