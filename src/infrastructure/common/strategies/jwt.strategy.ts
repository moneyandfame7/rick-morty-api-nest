import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { AuthService } from '../../services/auth/auth.service'
import { Request } from 'express'
import { EnvironmentConfigService } from '../../config/environment-config.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly config: EnvironmentConfigService, private readonly authService: AuthService) {
    super({
      /*  це поле для cookie або з Headers "Authorization" */
      jwtFromRequest: ExtractJwt.fromExtractors([ExtractJwt.fromAuthHeaderAsBearerToken(), JwtStrategy.extractJwtFromCookie]),
      ignoreExpiration: false,
      secretOrKey: config.getJwtAccessSecret()
    })
  }

  private static extractJwtFromCookie(req: Request) {
    /* ця функція достає токен з cookie */
    console.log('Extract JWT from cookie.')
    if (req.cookies && 'ACCESS_TOKEN' in req.cookies) {
      return req.cookies['ACCESS_TOKEN']
    }
    return null
  }

  async validate(payload) {
    /* це передається в req.user */
    return { ...payload, iat: undefined, exp: undefined }
  }
}