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

import { CategoriesService } from './categories.service'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'

@Controller('categories')
export class CategoriesController {

   constructor(private readonly service: CategoriesService) { }

   @Post()
   create(@Body() body: CreateCategoryDto) {
      return this.service.create(body)
   }

   @Get()
   findAll(@Query('brandId') brandId?: string) {

      if (brandId) {
         return this.service.findAllByBrand(Number(brandId))
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
      @Body() body: UpdateCategoryDto
   ) {
      return this.service.update(Number(id), body)
   }

   @Delete(':id')
   remove(@Param('id') id: string) {
      return this.service.remove(Number(id))
   }

}