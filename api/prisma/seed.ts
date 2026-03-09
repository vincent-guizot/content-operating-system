import { PrismaClient } from "@prisma/client"
import fs from "fs"

const prisma = new PrismaClient()

const data = JSON.parse(
   fs.readFileSync("./prisma/COSdata.json", "utf-8")
)

async function main() {

   console.log("Cleaning database...")

   await prisma.articleTag.deleteMany()
   await prisma.article.deleteMany()
   await prisma.media.deleteMany()
   await prisma.tag.deleteMany()
   await prisma.category.deleteMany()
   await prisma.brand.deleteMany()

   console.log("Database cleaned")

   console.log("Seeding brands...")

   await prisma.brand.createMany({
      data: data.brands.map((b: any) => ({
         id: Number(b.id),
         name: b.name,
         description: b.description,
         logoImage: b.logoImage
      }))
   })

   console.log("Seeding categories...")

   await prisma.category.createMany({
      data: data.categories.map((c: any) => ({
         id: Number(c.id),
         name: c.name,
         slug: c.slug ?? c.name.toLowerCase().replace(/\s+/g, "-"),
         brandId: Number(c.brandId)
      }))
   })

   console.log("Seeding tags...")

   await prisma.tag.createMany({
      data: data.tags.map((t: any) => ({
         id: Number(t.id),
         name: t.name,
         brandId: Number(t.brandId)
      }))
   })

   console.log("Seeding media...")

   await prisma.media.createMany({
      data: data.media.map((m: any) => ({
         id: Number(m.id),
         name: m.name,
         url: m.url
      }))
   })

   console.log("Seeding articles...")

   for (const article of data.articles) {

      const createdArticle = await prisma.article.create({
         data: {
            id: article.id,
            title: article.title,
            slug: article.slug,
            brandId: article.brandId,
            categoryId: article.categoryId,
            excerpt: article.excerpt,
            content: article.content,
            thumbnail: article.thumbnail,
            coverImage: article.coverImage,
            author: article.author,
            status: article.status,
            visibility: article.visibility,
            featured: article.featured,
            views: article.views,
            readingTime: article.readingTime,
            seoTitle: article.seoTitle,
            seoDescription: article.seoDescription,
            canonicalUrl: article.canonicalUrl,
            publishedAt: article.publishedAt
               ? new Date(article.publishedAt)
               : null
         }
      })

      if (article.tagIds) {

         await prisma.articleTag.createMany({
            data: article.tagIds.map((tagId: number) => ({
               articleId: createdArticle.id,
               tagId: tagId
            }))
         })

      }

   }

   console.log("Seed completed successfully")

}

main()
   .catch((e) => {
      console.error(e)
      process.exit(1)
   })
   .finally(async () => {
      await prisma.$disconnect()
   })