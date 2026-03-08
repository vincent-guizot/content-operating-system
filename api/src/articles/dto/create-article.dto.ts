import {
   IsBoolean,
   IsInt,
   IsOptional,
   IsString,
   IsArray
} from 'class-validator'

export class CreateArticleDto {

   @IsString()
   title: string

   @IsString()
   slug: string

   @IsInt()
   brandId: number

   @IsInt()
   categoryId: number

   @IsOptional()
   @IsString()
   excerpt?: string

   @IsString()
   content: string

   @IsOptional()
   @IsString()
   thumbnail?: string

   @IsOptional()
   @IsString()
   coverImage?: string

   @IsString()
   author: string

   @IsString()
   status: string

   @IsString()
   visibility: string

   @IsOptional()
   @IsBoolean()
   featured?: boolean

   @IsOptional()
   @IsInt()
   readingTime?: number

   @IsOptional()
   @IsString()
   seoTitle?: string

   @IsOptional()
   @IsString()
   seoDescription?: string

   @IsOptional()
   @IsString()
   canonicalUrl?: string

   @IsOptional()
   @IsArray()
   tagIds?: number[]

}