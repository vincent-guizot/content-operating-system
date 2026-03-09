import {
   Controller,
   Get,
   Post,
   Body,
   Param,
   Patch,
   Delete,
   UseInterceptors,
   UploadedFile
} from '@nestjs/common'

import { FileInterceptor } from "@nestjs/platform-express"
import type { Express } from "express"

import { MediaService } from './media.service'
import { CreateMediaDto } from './dto/create-media.dto'
import { UpdateMediaDto } from './dto/update-media.dto'

@Controller("media")
export class MediaController {

   constructor(private readonly service: MediaService) { }

   @Get()
   findAll() {
      return this.service.findAll()
   }

   @Get(":id")
   findOne(@Param("id") id: string) {
      return this.service.findOne(Number(id))
   }

   @Post("upload")
   @UseInterceptors(FileInterceptor("file"))
   upload(@UploadedFile() file: Express.Multer.File) {
      return this.service.upload(file)
   }

   @Delete(":id")
   remove(@Param("id") id: string) {
      return this.service.remove(Number(id))
   }

}