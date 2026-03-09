import {
   Controller,
   Get,
   Post,
   Body,
   Param,
   Put,
   Delete
} from '@nestjs/common'

import { ArticlesService } from './articles.service'
import { CreateArticleDto } from './dto/create-article.dto'
import { UpdateArticleDto } from './dto/update-article.dto'

@Controller('articles')
export class ArticlesController {

   constructor(private readonly service: ArticlesService) { }

   // CREATE
   @Post()
   create(@Body() body: CreateArticleDto) {
      return this.service.create(body)
   }

   // GET ALL
   @Get()
   findAll() {
      return this.service.findAll()
   }

   // GET SINGLE
   @Get(':id')
   findOne(@Param('id') id: string) {
      return this.service.findOne(Number(id))
   }

   // UPDATE
   @Put(':id')
   update(
      @Param('id') id: string,
      @Body() body: UpdateArticleDto
   ) {
      return this.service.update(Number(id), body)
   }

   // DELETE
   @Delete(':id')
   remove(@Param('id') id: string) {
      return this.service.remove(Number(id))
   }

}