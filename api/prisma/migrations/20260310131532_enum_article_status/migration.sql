/*
  Warnings:

  - A unique constraint covering the columns `[slug,brandId]` on the table `Article` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,brandId]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `status` on the `Article` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `visibility` on the `Article` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `readingTime` on table `Article` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "ArticleStatus" AS ENUM ('Draft', 'Published', 'Archived');

-- CreateEnum
CREATE TYPE "ArticleVisibility" AS ENUM ('Public', 'Private');

-- DropIndex
DROP INDEX "Article_slug_key";

-- AlterTable
ALTER TABLE "Article" DROP COLUMN "status",
ADD COLUMN     "status" "ArticleStatus" NOT NULL,
DROP COLUMN "visibility",
ADD COLUMN     "visibility" "ArticleVisibility" NOT NULL,
ALTER COLUMN "readingTime" SET NOT NULL,
ALTER COLUMN "readingTime" SET DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "Article_slug_brandId_key" ON "Article"("slug", "brandId");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_brandId_key" ON "Category"("name", "brandId");

-- CreateIndex
CREATE INDEX "Notification_entity_entityId_idx" ON "Notification"("entity", "entityId");
