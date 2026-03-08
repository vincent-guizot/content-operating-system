import {
   Controller,
   Get,
   Post,
   Body,
   Param,
   Patch,
   Delete,
   Query
} from '@nestjs/common'

import { TagsService } from './tags.service'
import { CreateTagDto } from './dto/create-tag.dto'
import { UpdateTagDto } from './dto/update-tag.dto'

@Controller('tags')
export class TagsController {

   constructor(private readonly service: TagsService) { }

   @Post()
   create(@Body() body: CreateTagDto) {
      return this.service.create(body)
   }

   @Get()
   findAll(@Query('brandId') brandId?: string) {

      if (brandId) {
         return this.service.findByBrand(Number(brandId))
      }

      return this.service.findAll()
   }

   @Get(':id')
   findOne(@Param('id') id: string) {
      return this.service.findOne(Number(id))
   }

   @Patch(':id')
   update(
      @Param('id') id: string,
      @Body() body: UpdateTagDto
   ) {
      return this.service.update(Number(id), body)
   }

   @Delete(':id')
   remove(@Param('id') id: string) {
      return this.service.remove(Number(id))
   }

}