import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateTagDto } from './dto/create-tag.dto'
import { UpdateTagDto } from './dto/update-tag.dto'

@Injectable()
export class TagsService {

   constructor(private prisma: PrismaService) { }

   async create(data: CreateTagDto) {
      return this.prisma.tag.create({
         data
      })
   }

   async findAll() {
      return this.prisma.tag.findMany({
         include: {
            brand: true
         },
         orderBy: {
            id: 'asc'
         }
      })
   }

   async findOne(id: number) {
      return this.prisma.tag.findUnique({
         where: { id },
         include: {
            brand: true
         }
      })
   }

   async update(id: number, data: UpdateTagDto) {
      return this.prisma.tag.update({
         where: { id },
         data
      })
   }

   async remove(id: number) {
      return this.prisma.tag.delete({
         where: { id }
      })
   }

}