import { IsString } from 'class-validator'

export class CreateMediaDto {

   @IsString()
   name: string

   @IsString()
   url: string

}