/*
  Warnings:

  - You are about to drop the column `code` on the `Problem` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "CodeLanguage" AS ENUM ('python', 'cpp', 'javascript', 'java');

-- AlterTable
ALTER TABLE "Problem" DROP COLUMN "code";

-- CreateTable
CREATE TABLE "Code" (
    "code_id" TEXT NOT NULL,
    "problem_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "language" "CodeLanguage" NOT NULL,
    "note" TEXT,
    "code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Code_pkey" PRIMARY KEY ("code_id")
);

-- AddForeignKey
ALTER TABLE "Code" ADD CONSTRAINT "Code_problem_id_fkey" FOREIGN KEY ("problem_id") REFERENCES "Problem"("problem_id") ON DELETE RESTRICT ON UPDATE CASCADE;
