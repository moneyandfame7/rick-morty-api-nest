import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'

import { AuthService } from '@app/services/auth/auth.service'
import { AuthController } from '@app/controllers/auth/auth.controller'

import { JwtStrategy } from '@common/strategies/jwt.strategy'
import { GoogleStrategy } from '@common/strategies/google.strategy'
import { GithubStrategy } from '@common/strategies/github.strategy'
import { DiscordStrategy } from '@common/strategies/discord.strategy'
import { SpotifyStrategy } from '@common/strategies/spotify.strategy'

import { EnvironmentConfigModule } from '@modules/common/environment-config.module'

import { TokenModule } from '@modules/common/token.module'
import { UserModule } from '@modules/common/user.module'
import { MailModule } from '@modules/common/mail.module'

@Module({
  imports: [JwtModule.register({ secret: process.env.AT_SECRET }), EnvironmentConfigModule, UserModule, PassportModule, TokenModule, MailModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, GoogleStrategy, GithubStrategy, DiscordStrategy, SpotifyStrategy],
  exports: [AuthService, JwtModule]
})
export class AuthModule {}