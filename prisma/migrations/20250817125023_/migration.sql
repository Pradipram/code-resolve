/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `UserProblemStatus` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Code" DROP CONSTRAINT "Code_problem_id_fkey";

-- AlterTable
ALTER TABLE "Code" ADD COLUMN     "user_problem_status_id" INTEGER,
ALTER COLUMN "problem_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "UserProblemStatus" ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "note" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "UserProblemStatus_id_key" ON "UserProblemStatus"("id");

-- AddForeignKey
ALTER TABLE "Code" ADD CONSTRAINT "Code_problem_id_fkey" FOREIGN KEY ("problem_id") REFERENCES "Problem"("problem_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Code" ADD CONSTRAINT "Code_user_problem_status_id_fkey" FOREIGN KEY ("user_problem_status_id") REFERENCES "UserProblemStatus"("id") ON DELETE SET NULL ON UPDATE CASCADE;
