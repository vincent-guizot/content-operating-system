import {
   Controller,
   Get,
   Post,
   Body,
   Param,
   Patch,
   Delete
} from '@nestjs/common'

import { BrandsService } from './brands.service'
import { CreateBrandDto } from './dto/create-brand.dto'
import { UpdateBrandDto } from './dto/update-brand.dto'

@Controller('brands')
export class BrandsController {

   constructor(private readonly service: BrandsService) { }

   @Post()
   create(@Body() body: CreateBrandDto) {
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
      @Body() body: UpdateBrandDto
   ) {
      return this.service.update(Number(id), body)
   }

   @Delete(':id')
   remove(@Param('id') id: string) {
      return this.service.remove(Number(id))
   }

}