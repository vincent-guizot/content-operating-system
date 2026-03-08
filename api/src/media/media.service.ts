import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateMediaDto } from './dto/create-media.dto'
import { UpdateMediaDto } from './dto/update-media.dto'

@Injectable()
export class MediaService {

   constructor(private prisma: PrismaService) { }

   async create(data: CreateMediaDto) {
      return this.prisma.media.create({
         data
      })
   }

   async findAll() {
      return this.prisma.media.findMany({
         orderBy: {
            createdAt: 'desc'
         }
      })
   }

   async findOne(id: number) {
      return this.prisma.media.findUnique({
         where: { id }
      })
   }

   async update(id: number, data: UpdateMediaDto) {
      return this.prisma.media.update({
         where: { id },
         data
      })
   }

   async remove(id: number) {
      return this.prisma.media.delete({
         where: { id }
      })
   }

}