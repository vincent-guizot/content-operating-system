import { NestFactory } from '@nestjs/core'
import { AppModule } from './app/app.module'
import { ValidationPipe } from '@nestjs/common'

import { HttpExceptionFilter } from './common/filters/http-exception.filter'
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter'

async function bootstrap() {

  const app = await NestFactory.create(AppModule)

  app.enableCors()

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        const messages = errors.map(err => {
          const constraints = Object.values(err.constraints || {})
          return `${err.property}: ${constraints.join(", ")}`
        })
        return new Error(messages.join(" | "))
      }
    })
  )

  app.useGlobalFilters(
    new PrismaExceptionFilter(),
    new HttpExceptionFilter()
  )

  const port = process.env.PORT || 3000

  await app.listen(port)

  console.log(`🚀 Orange Scrolls API running on port ${port}`)
}

bootstrap()