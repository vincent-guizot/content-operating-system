import {
   Controller,
   Get,
   Post,
   Body,
   Param,
   Patch,
   Delete
} from '@nestjs/common'

import { ArticlesService } from './articles.service'
import { CreateArticleDto } from './dto/create-article.dto'
import { UpdateArticleDto } from './dto/update-article.dto'

@Controller('articles')
export class ArticlesController {

   constructor(private readonly service: ArticlesService) { }

   @Post()
   create(@Body() body: CreateArticleDto) {
      return this.service.create(body)
   }

   @Get()
   findAll() {
      return this.service.findAll()
   }

   @Get('slug/:slug')
   findBySlug(@Param('slug') slug: string) {
      return this.service.findBySlug(slug)
   }

   @Get(':id')
   findOne(@Param('id') id: string) {
      return this.service.findOne(Number(id))
   }

   @Patch(':id')
   update(
      @Param('id') id: string,
      @Body() body: UpdateArticleDto
   ) {
      return this.service.update(Number(id), body)
   }

   @Delete(':id')
   remove(@Param('id') id: string) {
      return this.service.remove(Number(id))
   }

}