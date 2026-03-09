import {
   Controller,
   Get,
   Post,
   Body,
   Param,
   Put,
   Delete
} from '@nestjs/common'

import { BrandsService } from './brands.service'
import { CreateBrandDto } from './dto/create-brand.dto'
import { UpdateBrandDto } from './dto/update-brand.dto'

@Controller('brands')
export class BrandsController {

   constructor(private readonly service: BrandsService) { }

   // CREATE
   @Post()
   create(@Body() body: CreateBrandDto) {
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
      @Body() body: UpdateBrandDto
   ) {
      return this.service.update(Number(id), body)
   }

   // DELETE
   @Delete(':id')
   remove(@Param('id') id: string) {
      return this.service.remove(Number(id))
   }

}