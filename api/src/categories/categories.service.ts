import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'

@Injectable()
export class CategoriesService {

   constructor(private prisma: PrismaService) { }

   async create(data: CreateCategoryDto) {
      return this.prisma.category.create({
         data
      })
   }

   async findAll() {
      return this.prisma.category.findMany({
         include: {
            brand: true
         },
         orderBy: {
            id: 'asc'
         }
      })
   }

   async findOne(id: number) {
      return this.prisma.category.findUnique({
         where: { id },
         include: {
            brand: true
         }
      })
   }

   async update(id: number, data: UpdateCategoryDto) {
      return this.prisma.category.update({
         where: { id },
         data
      })
   }

   async remove(id: number) {
      return this.prisma.category.delete({
         where: { id }
      })
   }

}