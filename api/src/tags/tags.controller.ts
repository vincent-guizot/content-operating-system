import {
   Controller,
   Get,
   Post,
   Body,
   Param,
   Put,
   Delete
} from '@nestjs/common'

import { TagsService } from './tags.service'
import { CreateTagDto } from './dto/create-tag.dto'
import { UpdateTagDto } from './dto/update-tag.dto'

@Controller('tags')
export class TagsController {

   constructor(private readonly service: TagsService) { }

   // CREATE
   @Post()
   create(@Body() body: CreateTagDto) {
      return this.service.create(body)
   }

   // GET ALL
   @Get()
   findAll() {
      return this.service.findAll()
   }

   // GET ONE
   @Get(':id')
   findOne(@Param('id') id: string) {
      return this.service.findOne(Number(id))
   }

   // UPDATE
   @Put(':id')
   update(
      @Param('id') id: string,
      @Body() body: UpdateTagDto
   ) {
      return this.service.update(Number(id), body)
   }

   // DELETE
   @Delete(':id')
   remove(@Param('id') id: string) {
      return this.service.remove(Number(id))
   }

}