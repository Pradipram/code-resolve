/*
  Warnings:

  - The primary key for the `Problem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[problem_id]` on the table `Problem` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Problem" DROP CONSTRAINT "Problem_pkey",
ADD CONSTRAINT "Problem_pkey" PRIMARY KEY ("user_id", "problem_link");

-- CreateIndex
CREATE UNIQUE INDEX "Problem_problem_id_key" ON "Problem"("problem_id");
