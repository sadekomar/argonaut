-- CreateEnum
CREATE TYPE "PersonType" AS ENUM ('AUTHOR', 'CONTACT_PERSON', 'INTERNAL');

-- AlterTable
ALTER TABLE "Person" ADD COLUMN     "type" "PersonType" NOT NULL DEFAULT 'INTERNAL';
