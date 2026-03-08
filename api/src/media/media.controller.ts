import {
   Controller,
   Get,
   Post,
   Body,
   Param,
   Patch,
   Delete
} from '@nestjs/common'

import { MediaService } from './media.service'
import { CreateMediaDto } from './dto/create-media.dto'
import { UpdateMediaDto } from './dto/update-media.dto'

@Controller('media')
export class MediaController {

   constructor(private readonly service: MediaService) { }

   @Post()
   create(@Body() body: CreateMediaDto) {
      return this.service.create(body)
   }

   @Get()
   findAll() {
      return this.service.findAll()
   }

   @Get(':id')
   findOne(@Param('id') id: string) {
      return this.service.findOne(Number(id))
   }

   @Patch(':id')
   update(
      @Param('id') id: string,
      @Body() body: UpdateMediaDto
   ) {
      return this.service.update(Number(id), body)
   }

   @Delete(':id')
   remove(@Param('id') id: string) {
      return this.service.remove(Number(id))
   }

}