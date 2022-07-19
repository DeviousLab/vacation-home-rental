/*
  Warnings:

  - Added the required column `ownerId` to the `Home` table without a default value. This is not possible if the table is not empty.

*/
/* AlterTable */
ALTER TABLE "Home" ADD COLUMN "ownerId" TEXT;

/* UpdateData */
UPDATE "Home" SET "ownerId" = '<YOUR_USER_ID>' WHERE "ownerId" IS NULL;

/* AlterColumn */
ALTER TABLE "Home" ALTER COLUMN "ownerId" SET NOT NULL;

/* AddForeignKey */
ALTER TABLE "Home" ADD CONSTRAINT "Home_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
