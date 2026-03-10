import {
   ExceptionFilter,
   Catch,
   ArgumentsHost,
   HttpStatus
} from '@nestjs/common'

import { Prisma } from '@prisma/client'

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {

   catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {

      console.error("PRISMA ERROR:", exception)

      const ctx = host.switchToHttp()
      const response = ctx.getResponse()

      let message = "Database error"

      if (exception.code === "P2002") {
         message = "Duplicate data"
      }

      if (exception.code === "P2003") {
         message = "Invalid relation reference"
      }

      response.status(HttpStatus.BAD_REQUEST).json({
         success: false,
         statusCode: 400,
         message,
         code: exception.code,
         meta: exception.meta
      })
   }

}