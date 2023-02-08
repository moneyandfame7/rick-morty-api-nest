import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { UserModule } from '../user/user.module'
import { PassportModule } from '@nestjs/passport'
import { TokenModule } from '../token/token.module'
import { JwtStrategy } from './strategies/jwt/jwt.strategy'
import { JwtModule } from '@nestjs/jwt'
import { JwtAuthGuard } from './strategies/jwt/jwt.guard'
import { GoogleStrategy } from './strategies/google/google.strategy'
import { SessionSerializer } from './utils/session.serializer'

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard, GoogleStrategy, SessionSerializer],
  imports: [JwtModule.register({ secret: process.env.AT_SECRET }), UserModule, PassportModule, TokenModule],
  exports: [AuthService, JwtAuthGuard]
})
export class AuthModule {}
