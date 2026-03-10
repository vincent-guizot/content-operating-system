import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateArticleDto } from './dto/create-article.dto'
import { UpdateArticleDto } from './dto/update-article.dto'

@Injectable()
export class ArticlesService {

   constructor(private prisma: PrismaService) { }

   /* ---------------- CLEAN DATA ---------------- */

   private cleanData(data: any) {
      const cleaned: any = {}

      for (const key in data) {
         const value = data[key]

         if (
            value === null ||
            value === "" ||
            (typeof value === "string" && value.trim() === "")
         ) continue

         cleaned[key] = value
      }

      return cleaned
   }

   /* ---------------- CREATE ---------------- */

   async create(data: CreateArticleDto) {

      const { tagIds, tags, ...articleData } = data
      const cleanArticleData = this.cleanData(articleData)

      const existing = await this.prisma.article.findUnique({
         where: { slug: cleanArticleData.slug }
      })

      if (existing) {
         throw new BadRequestException("Slug already exists")
      }

      return this.prisma.$transaction(async (tx) => {

         const article = await tx.article.create({
            data: cleanArticleData
         })

         let finalTagIds: number[] = tagIds ? [...tagIds] : []

         if (tags?.length) {

            for (const rawTag of tags) {

               const tagName = rawTag.trim().toLowerCase()
               if (!tagName) continue

               let tag = await tx.tag.findFirst({
                  where: {
                     name: tagName,
                     brandId: cleanArticleData.brandId
                  }
               })

               if (!tag) {
                  tag = await tx.tag.create({
                     data: {
                        name: tagName,
                        brandId: cleanArticleData.brandId
                     }
                  })
               }

               finalTagIds.push(tag.id)
            }
         }

         if (finalTagIds.length) {
            await tx.articleTag.createMany({
               data: finalTagIds.map(tagId => ({
                  articleId: article.id,
                  tagId
               }))
            })
         }

         return tx.article.findUnique({
            where: { id: article.id },
            include: {
               brand: true,
               category: true,
               tags: { include: { tag: true } }
            }
         })

      })
   }

   /* ---------------- FIND ALL ---------------- */

   async findAll() {
      return this.prisma.article.findMany({
         include: {
            brand: true,
            category: true,
            tags: { include: { tag: true } }
         },
         orderBy: { createdAt: 'desc' }
      })
   }

   /* ---------------- FIND ONE ---------------- */

   async findOne(id: number) {

      const article = await this.prisma.article.findUnique({
         where: { id },
         include: {
            brand: true,
            category: true,
            tags: { include: { tag: true } }
         }
      })

      if (!article) {
         throw new NotFoundException("Article not found")
      }

      return article
   }

   /* ---------------- FIND BY SLUG ---------------- */

   async findOneBySlug(slug: string) {

      const article = await this.prisma.article.findUnique({
         where: { slug },
         include: {
            brand: true,
            category: true,
            tags: { include: { tag: true } }
         }
      })

      if (!article) {
         throw new NotFoundException("Article not found")
      }

      return {
         ...article,
         tags: article.tags.map(t => t.tag)
      }
   }

   /* ---------------- UPDATE ---------------- */

   async update(id: number, data: UpdateArticleDto) {

      const { tagIds, tags, ...articleData } = data
      const cleanArticleData = this.cleanData(articleData)

      const existing = await this.prisma.article.findUnique({
         where: { id }
      })

      if (!existing) {
         throw new NotFoundException("Article not found")
      }

      return this.prisma.$transaction(async (tx) => {

         const article = await tx.article.update({
            where: { id },
            data: cleanArticleData
         })

         await tx.articleTag.deleteMany({
            where: { articleId: article.id }
         })

         let finalTagIds: number[] = tagIds ? [...tagIds] : []

         if (tags?.length) {

            for (const rawTag of tags) {

               const tagName = rawTag.trim().toLowerCase()
               if (!tagName) continue

               let tag = await tx.tag.findFirst({
                  where: {
                     name: tagName,
                     brandId: article.brandId
                  }
               })

               if (!tag) {
                  tag = await tx.tag.create({
                     data: {
                        name: tagName,
                        brandId: article.brandId
                     }
                  })
               }

               finalTagIds.push(tag.id)
            }
         }

         if (finalTagIds.length) {
            await tx.articleTag.createMany({
               data: finalTagIds.map(tagId => ({
                  articleId: article.id,
                  tagId
               }))
            })
         }

         return tx.article.findUnique({
            where: { id: article.id },
            include: {
               brand: true,
               category: true,
               tags: { include: { tag: true } }
            }
         })

      })
   }

   /* ---------------- DELETE ---------------- */

   async remove(id: number) {

      const existing = await this.prisma.article.findUnique({
         where: { id }
      })

      if (!existing) {
         throw new NotFoundException("Article not found")
      }

      return this.prisma.article.delete({
         where: { id }
      })
   }

}