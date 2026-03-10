import {
   IsBoolean,
   IsInt,
   IsOptional,
   IsString,
   IsArray
} from 'class-validator'

export class CreateArticleDto {

   @IsOptional()
   @IsString()
   title?: string

   @IsOptional()
   @IsString()
   slug?: string

   @IsOptional()
   @IsInt()
   brandId?: number

   @IsOptional()
   @IsInt()
   categoryId?: number

   @IsOptional()
   @IsString()
   excerpt?: string

   @IsOptional()
   @IsString()
   content?: string

   @IsOptional()
   @IsString()
   thumbnail?: string

   @IsOptional()
   @IsString()
   coverImage?: string

   @IsOptional()
   @IsString()
   author?: string

   @IsOptional()
   @IsString()
   status?: string

   @IsOptional()
   @IsString()
   visibility?: string

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
   @IsInt({ each: true })
   tagIds?: number[]

   @IsOptional()
   @IsArray()
   @IsString({ each: true })
   tags?: string[]
}