import { Controller, Get,  Redirect, Res, UseGuards } from '@nestjs/common'
import type { Response } from 'express'

import { EnvironmentConfigService, TokenService, UserService } from '@app/services/common'
import { AuthorizationService } from '@app/services/authorization'

import { BaseAuthorizationController } from '@core/controllers/authorization'
import type { UserBeforeAuthentication } from '@core/models/common'
import type { AuthResponse } from '@core/models/authorization'

import { GetUser } from '@common/decorators'
import { GoogleAuthGuard } from '@common/guards/authorization'
import { ApiTags } from '@nestjs/swagger'

@Controller('/auth/google')
@ApiTags('google auth')
export class GoogleController extends BaseAuthorizationController {
  public constructor(
    protected readonly config: EnvironmentConfigService,
    protected readonly authService: AuthorizationService,
    protected readonly userService: UserService,
    protected readonly tokenService: TokenService
  ) {
    super(config, authService, userService, tokenService)
  }

  @Get('/login')
  @UseGuards(GoogleAuthGuard)
  public async login(): Promise<void> {}

  @Get('/redirect')
  @Redirect()
  @UseGuards(GoogleAuthGuard)
  public async redirect(@GetUser() user: UserBeforeAuthentication, @Res({ passthrough: true }) res: Response): Promise<{ url: string }> {
    const data = await this.socialLogin(user)
    this.setCookies(res, data.refresh_token, data.access_token)
    return {
      url: `http://localhost:3000/social?token=${data.access_token}`
    }
  }
}
