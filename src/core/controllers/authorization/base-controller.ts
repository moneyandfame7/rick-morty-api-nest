import type { Request, Response } from 'express'

import { AuthorizationService } from '@app/services/authorization'
import { EnvironmentConfigService, TokenService, UserService } from '@app/services/common'

import type { AuthorizationTokens } from '@core/models/authorization'
import type { GeneratedTokens, UserBeforeAuthentication } from '@core/models/common'

export class BaseAuthorizationController {
  public readonly CLIENT_URL: string
  public readonly REFRESH_TOKEN_COOKIE: string
  public readonly ACCESS_TOKEN_COOKIE: string
  public readonly REFRESH_TOKEN_EXPIRE_COOKIE: number = 30 * 24 * 60 * 60 * 1000 // 30 days
  public readonly ACCESS_TOKEN_EXPIRE_COOKIE: number = 30 * 60 * 1000 // 30 minutes
  protected constructor(
    protected readonly config: EnvironmentConfigService,
    protected readonly authService: AuthorizationService,
    protected readonly userService: UserService,
    protected tokenService: TokenService
  ) {
    this.REFRESH_TOKEN_COOKIE = this.config.getJwtRefreshCookie()
    this.ACCESS_TOKEN_COOKIE = this.config.getJwtAccessCookie()
    this.CLIENT_URL = this.config.getClientUrl()
  }

  public setCookies(res: Response, refresh_token: string, access_token: string): void {
    res.cookie(this.REFRESH_TOKEN_COOKIE, refresh_token, {
      httpOnly: true,
      maxAge: this.REFRESH_TOKEN_EXPIRE_COOKIE
    })
    res.cookie(this.ACCESS_TOKEN_COOKIE, access_token, {
      httpOnly: true,
      maxAge: this.ACCESS_TOKEN_EXPIRE_COOKIE
    })
  }

  public getCookies(req: Request): GeneratedTokens {
    return {
      refresh_token: req.cookies[this.REFRESH_TOKEN_COOKIE],
      access_token: req.cookies[this.ACCESS_TOKEN_COOKIE]
    }
  }

  public clearCookies(res: Response): void {
    res.clearCookie(this.REFRESH_TOKEN_COOKIE)
    res.clearCookie(this.ACCESS_TOKEN_COOKIE)
  }

  public async socialLogin(user: UserBeforeAuthentication): Promise<AuthorizationTokens> {
    const existUser = await this.userService.getOneByAuthType(user.email, user.auth_type)

    if (existUser) {
      return this.authService.buildUserInfoAndTokens(existUser)
      // const ifPassedWelcomePage = existUser.country || existUser.username || existUser.mail_subscribe
      // return {
      //   message: ifPassedWelcomePage ? 'User is finished registration' : 'User is redirected to welcome page',
      //   user: existUser,
      //   tokens
      // }
    }

    const info: UserBeforeAuthentication = {
      email: user.email,
      username: user.username,
      auth_type: user.auth_type,
      is_verified: true
    }
    const createdUser = await this.userService.createOne(info)
    return this.authService.buildUserInfoAndTokens(createdUser)
  }
}
