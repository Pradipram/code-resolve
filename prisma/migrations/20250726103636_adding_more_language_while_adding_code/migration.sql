-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "CodeLanguage" ADD VALUE 'csharp';
ALTER TYPE "CodeLanguage" ADD VALUE 'go';
ALTER TYPE "CodeLanguage" ADD VALUE 'ruby';
ALTER TYPE "CodeLanguage" ADD VALUE 'rust';
ALTER TYPE "CodeLanguage" ADD VALUE 'swift';
ALTER TYPE "CodeLanguage" ADD VALUE 'kotlin';
ALTER TYPE "CodeLanguage" ADD VALUE 'php';
ALTER TYPE "CodeLanguage" ADD VALUE 'shell';
ALTER TYPE "CodeLanguage" ADD VALUE 'json';
ALTER TYPE "CodeLanguage" ADD VALUE 'markdown';
ALTER TYPE "CodeLanguage" ADD VALUE 'html';
ALTER TYPE "CodeLanguage" ADD VALUE 'css';
ALTER TYPE "CodeLanguage" ADD VALUE 'xml';
ALTER TYPE "CodeLanguage" ADD VALUE 'sql';
ALTER TYPE "CodeLanguage" ADD VALUE 'yaml';
ALTER TYPE "CodeLanguage" ADD VALUE 'perl';
ALTER TYPE "CodeLanguage" ADD VALUE 'r';
ALTER TYPE "CodeLanguage" ADD VALUE 'scala';
ALTER TYPE "CodeLanguage" ADD VALUE 'dart';
ALTER TYPE "CodeLanguage" ADD VALUE 'objectivec';
ALTER TYPE "CodeLanguage" ADD VALUE 'vb';
ALTER TYPE "CodeLanguage" ADD VALUE 'lua';
ALTER TYPE "CodeLanguage" ADD VALUE 'haskell';
ALTER TYPE "CodeLanguage" ADD VALUE 'julia';
