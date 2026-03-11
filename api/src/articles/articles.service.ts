import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateArticleDto } from './dto/create-article.dto'
import { UpdateArticleDto } from './dto/update-article.dto'
import { Category } from '@prisma/client'

@Injectable()
export class ArticlesService {
   constructor(private prisma: PrismaService) { }
   //// CLEAN EMPTY VALUES
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

   //// HANDLE TAGS
   private async handleTags(
      tx: any,
      articleId: number,
      brandId: number,
      tags?: string[]
   ) {

      if (!tags?.length) return

      // NORMALIZE TAGS
      const tagNames = tags
         .map(t => t.trim().toLowerCase())
         .filter(Boolean)

      // FIND EXISTING TAGS
      const existingTags = await tx.tag.findMany({
         where: {
            brandId,
            name: { in: tagNames }
         }
      })

      const existingNames = existingTags.map(t => t.name)

      // FIND NEW TAGS
      const newTags = tagNames.filter(
         name => !existingNames.includes(name)
      )

      // CREATE NEW TAGS (BULK)
      if (newTags.length) {
         await tx.tag.createMany({
            data: newTags.map(name => ({
               name,
               brandId
            })),
            skipDuplicates: true
         })
      }

      // GET ALL TAGS AGAIN
      const allTags = await tx.tag.findMany({
         where: {
            brandId,
            name: { in: tagNames }
         }
      })

      // CREATE ARTICLE TAG RELATION
      await tx.articleTag.createMany({
         data: allTags.map(tag => ({
            articleId,
            tagId: tag.id
         })),
         skipDuplicates: true
      })

   }

   //// CREATE ARTICLE
   async create(data: CreateArticleDto) {

      const { tags, ...articleData } = data

      const cleanedData = this.cleanData(articleData)

      return this.prisma.$transaction(async (tx) => {

         // CREATE ARTICLE
         const article = await tx.article.create({
            data: cleanedData
         })

         // HANDLE TAGS
         await this.handleTags(
            tx,
            article.id,
            article.brandId,
            tags
         )

         // RETURN ARTICLE
         return tx.article.findUnique({
            where: { id: article.id },
            include: {
               brand: true,
               category: true,
               tags: {
                  include: {
                     tag: true
                  }
               }
            }
         })

      })

   }

   //// FIND ALL
   async findAll() {
      return this.prisma.article.findMany({
         include: {
            brand: true,
            category: true,
            tags: {
               include: {
                  tag: true
               }
            }
         },
         orderBy: {
            createdAt: 'desc'
         }
      })
   }

   //// FIND ONE
   async findOne(id: number) {

      const article = await this.prisma.article.findUnique({
         where: { id },
         include: {
            brand: true,
            category: true,
            tags: {
               include: {
                  tag: true
               }
            }
         }
      })

      if (!article)
         throw new NotFoundException("Article not found")

      return article
   }

   //// DELETE
   async remove(id: number) {

      const article = await this.prisma.article.findUnique({
         where: { id }
      })

      if (!article)
         throw new NotFoundException("Article not found")

      return this.prisma.article.delete({
         where: { id }
      })

   }

   //// FIND BY SLUG
   async findOneBySlug(slug: string) {

      const article = await this.prisma.article.findFirst({
         where: { slug },
         include: {
            brand: true,
            category: true,
            tags: {
               include: {
                  tag: true
               }
            }
         }
      })

      if (!article)
         throw new NotFoundException("Article not found")

      return article
   }
   //// UPDATE
   async update(id: number, data: UpdateArticleDto) {

      const { tags, ...articleData } = data

      const cleanedData = this.cleanData(articleData)

      const existing = await this.prisma.article.findUnique({
         where: { id }
      })

      if (!existing)
         throw new NotFoundException("Article not found")

      return this.prisma.$transaction(async (tx) => {

         const article = await tx.article.update({
            where: { id },
            data: cleanedData
         })

         // delete old relations
         await tx.articleTag.deleteMany({
            where: { articleId: id }
         })

         // handle new tags
         await this.handleTags(
            tx,
            article.id,
            article.brandId,
            tags
         )

         return tx.article.findUnique({
            where: { id },
            include: {
               brand: true,
               category: true,
               tags: {
                  include: {
                     tag: true
                  }
               }
            }
         })

      })

   }
}