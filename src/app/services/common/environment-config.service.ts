import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import type { AuthorizationConfig, DatabaseConfig, S3BucketConfig } from '@core/config'

@Injectable()
export class EnvironmentConfigService implements AuthorizationConfig, S3BucketConfig, DatabaseConfig {
  public constructor(private readonly configService: ConfigService) {}

  private getStringEnv(env: string): string {
    const value = this.configService.get<string>(env)
    if (!value) {
      throw new InternalServerErrorException('Environment variable not specified')
    }
    return value
  }

  private getNumberEnv(env: string): number {
    const value = this.configService.get<number>(env)
    if (!value) {
      throw new InternalServerErrorException('Environment variable not specified')
    }
    return value
  }

  /**
   * Common configurations
   **/
  public getBaseUrl(): string {
    return this.getStringEnv('BASE_URL')
  }

  public getClientUrl(): string {
    return this.getStringEnv('CLIENT_URL')
  }

  public getClientSuccessRedirect(): string {
    return this.getClientUrl() + '/login/success'
  }

  /**
   * Mailer credentials
   **/
  public getMailerHost(): string {
    return this.getStringEnv('MAILER_HOST')
  }

  public getMailerPort(): number {
    return this.getNumberEnv('MAILER_PORT')
  }

  public getMailerUser(): string {
    return this.getStringEnv('MAILER_USER')
  }

  public getMailerPassword(): string {
    return this.getStringEnv('MAILER_PASSWORD')
  }

  /**
   * Database credentials
   **/
  public getDatabaseHost(): string {
    return this.getStringEnv('DB_HOST')
  }

  public getDatabaseName(): string {
    return this.getStringEnv('DB_NAME')
  }

  public getDatabasePassword(): string {
    return this.getStringEnv('DB_PASSWORD')
  }

  public getDatabasePort(): number {
    return this.getNumberEnv('DB_PORT')
  }

  public getDatabaseUsername(): string {
    return this.getStringEnv('DB_USERNAME')
  }

  /**
   * S3Bucket credentials
   **/
  public getS3BucketAccessKey(): string {
    return this.getStringEnv('S3BUCKET_ACCESS_KEY')
  }

  public getS3BucketAccessSecret(): string {
    return this.getStringEnv('S3BUCKET_ACCESS_SECRET')
  }

  public getS3BucketName(): string {
    return this.getStringEnv('S3BUCKET_NAME')
  }

  public getS3BucketRegion(): string {
    return this.getStringEnv('S3BUCKET_REGION')
  }

  public getS3BucketUrl(): string {
    return this.getStringEnv('S3BUCKET_URL')
  }

  /**
   * JWT credentials
   **/
  public getJwtAccessCookie(): string {
    return this.getStringEnv('JWT_ACCESS_COOKIE')
  }

  public getJwtAccessSecret(): string {
    return this.getStringEnv('JWT_ACCESS_SECRET')
  }

  public getJwtRefreshCookie(): string {
    return this.getStringEnv('JWT_REFRESH_COOKIE')
  }

  public getJwtRefreshSecret(): string {
    return this.getStringEnv('JWT_REFRESH_SECRET')
  }

  public getJwtAccessExpires(): number {
    return this.getNumberEnv('JWT_ACCESS_EXPIRES') /* 15 * 60 * 1000 // 15minutes */
  }

  public getJwtRefreshExpires(): number {
    return this.getNumberEnv('JWT_REFRESH_EXPIRES') /* 30 * 24 * 60 * 60 * 1000 // 30d */
  }

  /**
   * Google credentials
   **/
  public getGoogleCallbackUrl(): string {
    return this.getBaseUrl() + '/auth/google/redirect'
  }

  public getGoogleClientId(): string {
    return this.getStringEnv('GOOGLE_CLIENT_ID')
  }

  public getGoogleClientSecret(): string {
    return this.getStringEnv('GOOGLE_CLIENT_SECRET')
  }

  /**
   * Discord credentials
   **/
  public getDiscordCallbackUrl(): string {
    return this.getBaseUrl() + '/auth/discord/redirect'
  }

  public getDiscordClientId(): string {
    return this.getStringEnv('DISCORD_CLIENT_ID')
  }

  public getDiscordClientSecret(): string {
    return this.getStringEnv('DISCORD_CLIENT_SECRET')
  }

  /**
   * GitHub credentials
   **/
  public getGithubCallbackUrl(): string {
    return this.getBaseUrl() + '/auth/github/redirect'
  }

  public getGithubClientId(): string {
    return this.getStringEnv('GITHUB_CLIENT_ID')
  }

  public getGithubClientSecret(): string {
    return this.getStringEnv('GITHUB_CLIENT_SECRET')
  }

  /**
   * Spotify credentials
   **/
  public getSpotifyCallbackUrl(): string {
    return this.getBaseUrl() + '/auth/spotify/redirect'
  }

  public getSpotifyClientId(): string {
    return this.getStringEnv('SPOTIFY_CLIENT_ID')
  }

  public getSpotifyClientSecret(): string {
    return this.getStringEnv('SPOTIFY_CLIENT_SECRET')
  }
}
