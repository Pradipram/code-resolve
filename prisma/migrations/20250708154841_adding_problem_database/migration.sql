-- CreateTable
CREATE TABLE "Problem" (
    "problem_id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "problem_name" TEXT NOT NULL,
    "problem_link" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "code" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Problem_pkey" PRIMARY KEY ("problem_id")
);
