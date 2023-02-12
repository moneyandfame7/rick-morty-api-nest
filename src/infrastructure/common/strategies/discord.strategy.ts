import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Profile, Strategy } from 'passport-discord'
import { UserService } from '../../services/common/user.service'
import { EnvironmentConfigService } from '../../config/environment-config.service'

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, 'discord') {
  private readonly DISCORD_AVATARS_URL = 'https://cdn.discordapp.com/avatars'
  constructor(private readonly config: EnvironmentConfigService, private readonly userService: UserService) {
    super({
      clientID: config.getDiscordClientId(),
      clientSecret: config.getDiscordClientSecret(),
      callbackURL: config.getDiscordCallbackUrl(),
      scope: ['identify', 'email']
    })
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    console.log(profile)

    const userInfo = {
      username: profile.username,
      email: profile.email,
      password: null,
      authType: profile.provider,
      /* https://stackoverflow.com/questions/65450055/how-to-get-avatar-from-discord-api */
      photo: `${this.DISCORD_AVATARS_URL}/${profile.id}/${profile.avatar}`
    }

    const userWithSameAuthType = await this.userService.getOneByAuthType(userInfo.email, userInfo.authType)

    if (userWithSameAuthType) return userWithSameAuthType

    return await this.userService.createOne(userInfo)
  }
}