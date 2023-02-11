import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Roles } from '../roles/roles.decorator'
import { RolesGuard } from '../roles/roles.guard'
import { AddRoleDto } from './dto/add-role.dto'
import { BanUserDto } from './dto/ban-user-dto'
import { RolesEnum } from '../roles/roles.enum'

@Controller('api/users')
@ApiTags('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createOne(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createOne(createUserDto)
  }

  @Get()
  async getMany() {
    return await this.userService.getMany()
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return await this.userService.getOneById(id)
  }

  @Patch(':id')
  async updateOne(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.userService.updateOne(id, updateUserDto)
  }

  @Delete(':id')
  // @Roles(RolesEnum.ADMIN)
  // @UseGuards(RolesGuard)
  async removeOne(@Param('id') id: string) {
    return await this.userService.removeOne(id)
  }

  @ApiOperation({ summary: 'Give a role' })
  @ApiResponse({ status: 200 })
  @Roles(RolesEnum.ADMIN)
  @UseGuards(RolesGuard)
  @Post('/role')
  async addRole(@Body() addRoleDto: AddRoleDto) {
    return await this.userService.addRole(addRoleDto)
  }

  @ApiOperation({ summary: 'Ban a user' })
  @ApiResponse({ status: 200 })
  @Roles(RolesEnum.ADMIN)
  @UseGuards(RolesGuard)
  @Post('/ban')
  async ban(@Body() banUserDto: BanUserDto) {
    return await this.userService.ban(banUserDto)
  }
}
