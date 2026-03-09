import { Injectable } from "@nestjs/common"
import { PrismaService } from "../../prisma/prisma.service"
import { supabase } from "../lib/supabase"

import type { Express } from 'express'

@Injectable()
export class MediaService {

   constructor(private prisma: PrismaService) { }

   async upload(file: Express.Multer.File) {

      const fileName = `${Date.now()}-${file.originalname}`

      const { error } = await supabase.storage
         .from(process.env.SUPABASE_BUCKET!)
         .upload(fileName, file.buffer, {
            contentType: file.mimetype
         })

      if (error) {
         throw new Error(error.message)
      }

      const url =
         `${process.env.SUPABASE_URL!}/storage/v1/object/public/${process.env.SUPABASE_BUCKET!}/${fileName}`

      return this.prisma.media.create({
         data: {
            name: fileName,
            url
         }
      })
   }

   async findAll() {
      return this.prisma.media.findMany({
         orderBy: {
            createdAt: "desc"
         }
      })
   }

   async findOne(id: number) {
      return this.prisma.media.findUnique({
         where: { id }
      })
   }

   async remove(id: number) {

      const media = await this.prisma.media.findUnique({
         where: { id }
      })

      if (!media) {
         throw new Error("Media not found")
      }

      const fileName = media.name

      await supabase.storage
         .from(process.env.SUPABASE_BUCKET!)
         .remove([fileName])

      return this.prisma.media.delete({
         where: { id }
      })
   }

}