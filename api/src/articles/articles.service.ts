import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateArticleDto } from './dto/create-article.dto'
import { UpdateArticleDto } from './dto/update-article.dto'
import { Category } from '@prisma/client'
@Injectable()
export class ArticlesService {
   constructor(private prisma: PrismaService) { }

   /* CLEAN EMPTY VALUES */
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

   /* VALIDATE CREATE PAYLOAD */
   private async validateCreate(data: any) {
      const errors: any = {}

      if (!data.title || data.title.trim() === "")
         errors.title = "Title is required"

      if (!data.slug || data.slug.trim() === "")
         errors.slug = "Slug is required"

      if (!data.brandId)
         errors.brandId = "Brand is required"

      if (!data.categoryId)
         errors.categoryId = "Category is required"

      if (!data.content || data.content.trim() === "")
         errors.content = "Content is required"

      if (!data.status)
         errors.status = "Status is required"

      if (!data.visibility)
         errors.visibility = "Visibility is required"

      /* SLUG DUPLICATE */
      if (data.slug) {
         const existing = await this.prisma.article.findUnique({
            where: { slug: data.slug }
         })

         if (existing)
            errors.slug = "Slug already exists"
      }

      /* BRAND CHECK */
      if (data.brandId) {
         const brand = await this.prisma.brand.findUnique({
            where: { id: data.brandId }
         })
         if (!brand)
            errors.brandId = "Brand not found"

      }

      /* CATEGORY CHECK */
      let category: Category | null = null


      if (data.categoryId) {
         category = await this.prisma.category.findUnique({
            where: { id: data.categoryId }
         })

         if (!category)
            errors.categoryId = "Category not found"
      }

      /* CATEGORY BELONGS TO BRAND */

      if (category && data.brandId) {
         if (category.brandId !== data.brandId)
            errors.categoryId = "Category does not belong to selected brand"

      }

      if (Object.keys(errors).length > 0) {
         throw new BadRequestException({
            message: "Validation failed",
            errors
         })
      }
   }

   /* HANDLE TAGS */

   private async handleTags(
      tx: any,
      articleId: number,
      brandId: number,
      tagIds?: number[],
      tags?: string[]
   ) {

      const finalTagIds: number[] = [...(tagIds ?? [])]

      if (tags?.length) {

         for (const rawTag of tags) {

            const tagName = rawTag.trim().toLowerCase()

            if (!tagName) continue

            const tag = await tx.tag.upsert({
               where: {
                  name_brandId: {
                     name: tagName,
                     brandId: brandId
                  }
               },
               update: {},
               create: {
                  name: tagName,
                  brandId: brandId
               }
            })

            finalTagIds.push(tag.id)

         }

      }

      if (finalTagIds.length) {

         await tx.articleTag.createMany({
            data: finalTagIds.map(tagId => ({
               articleId,
               tagId
            }))
         })

      }

   }

   /* CREATE */

   async create(data: CreateArticleDto) {
      console.log("CREATE ARTICLE PAYLOAD:", data)

      try {
         const { tagIds, tags, ...articleData } = data
         const cleanedData = this.cleanData(articleData)

         console.log("CLEANED DATA:", cleanedData)

         await this.validateCreate(cleanedData)
         return await this.prisma.$transaction(async (tx) => {
            const article = await tx.article.create({
               data: cleanedData
            })

            console.log("ARTICLE CREATED:", article.id)
            await this.handleTags(
               tx,
               article.id,
               article.brandId,
               tagIds,
               tags
            )

            console.log("TAGS HANDLED")
            return await tx.article.findUnique({
               where: { id: article.id },
               include: {
                  brand: true,
                  category: true,
                  tags: { include: { tag: true } }
               }
            })
         })

      } catch (error) {
         console.error("ARTICLE CREATE ERROR:", error)
         throw error
      }

   }

   /* FIND ALL */

   async findAll() {
      return this.prisma.article.findMany({
         include: {
            brand: true,
            category: true,
            tags: { include: { tag: true } }
         },
         orderBy: { createdAt: "desc" }
      })
   }

   /* FIND ONE */

   async findOne(id: number) {
      const article = await this.prisma.article.findUnique({
         where: { id },
         include: {
            brand: true,
            category: true,
            tags: { include: { tag: true } }
         }
      })

      if (!article)
         throw new NotFoundException("Article not found")

      return article
   }

   /* FIND BY SLUG */

   async findOneBySlug(slug: string) {
      const article = await this.prisma.article.findUnique({
         where: { slug },
         include: {
            brand: true,
            category: true,
            tags: { include: { tag: true } }
         }
      })

      if (!article)
         throw new NotFoundException("Article not found")

      return {
         ...article,
         tags: article.tags.map(t => t.tag)
      }
   }

   /* UPDATE */
   async update(id: number, data: UpdateArticleDto) {
      const { tagIds, tags, ...articleData } = data
      const cleanData = this.cleanData(articleData)

      const existing = await this.prisma.article.findUnique({
         where: { id }
      })

      if (!existing)
         throw new NotFoundException("Article not found")

      if (cleanData.slug) {
         const duplicate = await this.prisma.article.findFirst({
            where: {
               slug: cleanData.slug,
               NOT: { id }
            }
         })

         if (duplicate)
            throw new BadRequestException("Slug already exists")

      }

      return this.prisma.$transaction(async (tx) => {
         const article = await tx.article.update({
            where: { id },
            data: cleanData
         })

         await tx.articleTag.deleteMany({
            where: { articleId: id }
         })

         await this.handleTags(
            tx,
            article.id,
            article.brandId,
            tagIds,
            tags
         )

         return tx.article.findUnique({
            where: { id },
            include: {
               brand: true,
               category: true,
               tags: { include: { tag: true } }
            }
         })

      })

   }

   /* DELETE */
   async remove(id: number) {
      const existing = await this.prisma.article.findUnique({
         where: { id }
      })
      if (!existing)
         throw new NotFoundException("Article not found")

      return this.prisma.article.delete({
         where: { id }
      })
   }

}