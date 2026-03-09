import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateArticleDto } from './dto/create-article.dto'
import { UpdateArticleDto } from './dto/update-article.dto'

@Injectable()
export class ArticlesService {

   constructor(private prisma: PrismaService) { }

   async create(data: CreateArticleDto) {

      const { tagIds, ...articleData } = data

      return this.prisma.article.create({
         data: {
            ...articleData,
            tags: tagIds
               ? {
                  create: tagIds.map(tagId => ({
                     tag: { connect: { id: tagId } }
                  }))
               }
               : undefined
         },
         include: {
            brand: true,
            category: true,
            tags: {
               include: { tag: true }
            }
         }
      })
   }

   async findAll() {
      return this.prisma.article.findMany({
         include: {
            brand: true,
            category: true,
            tags: {
               include: { tag: true }
            }
         },
         orderBy: {
            createdAt: 'asc'
         }
      })
   }

   async findOne(id: number) {
      return this.prisma.article.findUnique({
         where: { id },
         include: {
            brand: true,
            category: true,
            tags: {
               include: { tag: true }
            }
         }
      })
   }

   async findOneBySlug(slug: string) {
      const article = await this.prisma.article.findUnique({
         where: { slug },
         include: {
            brand: true,
            category: true,
            tags: {
               include: { tag: true }
            }
         }
      })

      if (!article) {
         throw new Error("Article not found")
      }

      return {
         ...article,
         tags: article.tags.map((t) => t.tag)
      }
   }

   async update(id: number, data: UpdateArticleDto) {

      const { tagIds, ...articleData } = data

      return this.prisma.article.update({
         where: { id },
         data: {
            ...articleData,
            tags: tagIds
               ? {
                  deleteMany: { articleId: id },
                  create: tagIds.map(tagId => ({
                     tag: { connect: { id: tagId } }
                  }))
               }
               : undefined
         },
         include: {
            brand: true,
            category: true,
            tags: {
               include: { tag: true }
            }
         }
      })
   }

   async remove(id: number) {
      return this.prisma.article.delete({
         where: { id }
      })
   }

}