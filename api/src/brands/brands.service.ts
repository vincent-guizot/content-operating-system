import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateBrandDto } from './dto/create-brand.dto'
import { UpdateBrandDto } from './dto/update-brand.dto'

@Injectable()
export class BrandsService {

   constructor(private prisma: PrismaService) { }

   async create(data: CreateBrandDto) {
      return this.prisma.brand.create({
         data
      })
   }

   async findAll() {
      return this.prisma.brand.findMany({
         orderBy: {
            id: 'desc'
         }
      })
   }

   async findOne(id: number) {
      return this.prisma.brand.findUnique({
         where: { id }
      })
   }

   async update(id: number, data: UpdateBrandDto) {
      return this.prisma.brand.update({
         where: { id },
         data
      })
   }

   async remove(id: number) {
      return this.prisma.brand.delete({
         where: { id }
      })
   }

}