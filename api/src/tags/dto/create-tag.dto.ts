import { IsInt, IsString } from 'class-validator'

export class CreateTagDto {

   @IsString()
   name: string

   @IsInt()
   brandId: number

}