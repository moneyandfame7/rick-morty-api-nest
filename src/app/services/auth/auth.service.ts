import { BadRequestException, Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { v4 as uuid } from 'uuid'

import { MailService } from '@app/services/common/mail.service'
import { TokenService } from '@app/services/common/token.service'
import { UserService } from '@app/services/common/user.service'
import { AuthDto } from '@app/dto/auth/auth.dto'
import { ResetPasswordDto, UserDetailsDto } from '@app/dto/common/user.dto'

import { Token } from '@infrastructure/entities/common/token.entity'
import { User } from '@infrastructure/entities/common/user.entity'

import { AuthTokens, JwtPayload, UserBeforeAuthentication } from '@core/models'

import { UserNotFoundException } from '@common/exceptions/common/user.exception'

import { EnvironmentConfigService } from '@app/services/common/environment-config.service'

@Injectable()
export class AuthService {
  public constructor(
    private readonly config: EnvironmentConfigService,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly mailService: MailService
  ) {}

  public async signup(dto: AuthDto): Promise<AuthTokens> {
    const errorResponse = {
      errors: {}
    }
    const withSameEmail = await this.userService.getOneByAuthType(dto.email, 'jwt')
    if (withSameEmail) {
      errorResponse.errors['email'] = 'the email address is already taken'
      throw new UnprocessableEntityException(errorResponse)
    }
    const hashedPassword = await this.hashPassword(dto.password)
    const verify_link = uuid()
    const info: UserBeforeAuthentication = {
      email: dto.email,
      password: hashedPassword,
      auth_type: 'jwt',
      is_verified: false,
      verify_link
    }
    const user = await this.userService.createOne(info)
    await this.mailService.sendVerifyMail(user.email, verify_link)

    return this.buildUserInfoAndTokens(user)
    // return {
    //   message: 'User is redirected to Welcome page',
    //   body: {
    //     user,
    //     tokens
    //   }
    // }
  }

  public async welcomePage(token: string, details: UserDetailsDto): Promise<AuthTokens> {
    const welcomePageUser = this.tokenService.validateAccessToken(token)

    const user = await this.userService.updateOne(welcomePageUser.id, details)
    return this.buildUserInfoAndTokens(user)
    // return {
    //   message: 'User is redirected to Home page',
    //   body: {
    //     user,
    //     tokens
    //   }
    // }
  }

  public async login(userDto: AuthDto): Promise<AuthTokens> {
    const user = await this.validateUser(userDto)
    return this.buildUserInfoAndTokens(user)

    // if (!(user.username || user.country || user.mail_subscribe)) {
    //   return {
    //     message: 'User is redirected to Welcome page',
    //     body: {
    //       user,
    //       tokens
    //     }
    //   }
    // }
    //
    // return { message: 'User is redirected to Home page', body: { user, tokens } }
  }

  public logout(refreshToken: string): Promise<Token> {
    return this.tokenService.removeByToken(refreshToken)
  }

  public status(tokens: AuthTokens): JwtPayload {
    return this.tokenService.validateAccessToken(tokens.access_token)
  }

  public async refresh(refreshToken: string): Promise<AuthTokens> {
    if (!refreshToken) {
      throw new UnauthorizedException()
    }

    const userData = this.tokenService.validateRefreshToken(refreshToken)
    const tokenFromDatabase = await this.tokenService.getOne(refreshToken)
    if (!userData || !tokenFromDatabase) {
      throw new UnauthorizedException()
    }
    const user = await this.userService.getOneById(userData.id)

    return this.buildUserInfoAndTokens(user)
  }

  public async verify(link: string): Promise<AuthTokens> {
    const errorResponse = {
      errors: {}
    }
    const user = await this.userService.getOneByVerifyLink(link)

    if (!user) {
      errorResponse.errors['link'] = 'Incorrect verification link'
      throw new BadRequestException('Incorrect verification link')
    }
    if (user.is_verified) {
      throw new BadRequestException('User already verified')
    }
    const updated = await this.userService.updateOne(user.id, { is_verified: true })
    return this.buildUserInfoAndTokens(updated)
  }

  public async forgot(email: string): Promise<string> {
    const errorResponse = {
      errors: {}
    }
    const user = await this.userService.getOneByAuthType(email, 'jwt')
    if (!user) {
      errorResponse.errors['email'] = 'Incorrect email'
      throw new UserNotFoundException()
    }
    const payload = {
      id: user.id,
      email: user.email,
      username: user.username
    }
    const token = this.tokenService.generateTempToken(payload)
    const link = `${this.config.getClientUrl()}/auth/reset/${user.id}/${token}`
    await this.mailService.sendForgotPasswordLink(user.email, link)

    return link
  }

  public async reset(id: string, token: string, dto: ResetPasswordDto): Promise<AuthTokens> {
    const errorResponse = {
      errors: {}
    }
    const user = await this.userService.getOneById(id)

    if (!user) {
      throw new UserNotFoundException()
    }
    const compare = await this.comparePassword(dto.password, user.password)
    if (compare) {
      errorResponse.errors['password'] = 'Password is equal to old password'
      throw new BadRequestException(errorResponse)
    }
    this.tokenService.validateTempToken(token)
    if (dto.password !== dto.confirmPassword) {
      errorResponse.errors['password'] = "Password don't match"
      throw new BadRequestException(errorResponse)
    }
    const hashedPassword = await this.hashPassword(dto.password)
    const updated = await this.userService.updateOne(id, { password: hashedPassword })
    return this.buildUserInfoAndTokens(updated)
  }

  public async buildUserInfoAndTokens(user: User): Promise<AuthTokens> {
    const tokens = await this.tokenService.generateTokens(user)
    await this.tokenService.saveToken(user.id, tokens.refresh_token)
    return tokens
  }

  private async validateUser(userDto: AuthDto): Promise<User> {
    const errorResponse = {
      errors: {}
    }
    const user = await this.userService.getOneByAuthType(userDto.email, 'jwt')
    if (!user) {
      errorResponse.errors['email'] = 'Incorrect email'
      throw new UnprocessableEntityException(errorResponse)
    }

    const passwordEquals = await this.comparePassword(userDto.password, user.password)
    if (!passwordEquals) {
      errorResponse.errors['password'] = 'Incorrect password'
      throw new UnprocessableEntityException(errorResponse)
    }

    return user
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 3)
  }

  private async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }
}