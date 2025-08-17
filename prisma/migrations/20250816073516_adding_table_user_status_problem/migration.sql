-- CreateTable
CREATE TABLE "UserProblemStatus" (
    "user_id" TEXT NOT NULL,
    "problem_id" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "UserProblemStatus_pkey" PRIMARY KEY ("user_id","problem_id")
);
