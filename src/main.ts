import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import 'dotenv/config'

import * as cookieParser from 'cookie-parser'

import { AppModule } from '@app/app.module'
import { EnvironmentConfigService } from '@app/services/common'

import { CustomValidationPipe } from '@common/pipes'

async function bootstrap(): Promise<void> {
  const PORT = process.env.PORT ?? 3001
  const app = await NestFactory.create(AppModule, {
    cors: { origin: process.env.CLIENT_URL, credentials: true }
  })
  const envConfig = app.get(EnvironmentConfigService)
  envConfig.getBaseUrl()
  app.useGlobalPipes(new CustomValidationPipe())
  app.use(cookieParser())

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('The Rick & Morty API')
    .setDescription('The Rick and Morty API is a REST API based on the Rick and Morty TV show!')
    .setVersion('1.0.0')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('/api/docs', app, document, { customSiteTitle: 'Documentation' })

  await app.listen(PORT)
}

bootstrap().then(() => {
  console.log(` >> 🥶️🚀Server started on ${process.env.BASE_URL} >> `) // eslint-disable-line
})
