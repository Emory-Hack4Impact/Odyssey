/*
  Warnings:

  - You are about to drop the column `userId` on the `TimeOffRequest` table. All the data in the column will be lost.
  - Added the required column `employeeId` to the `TimeOffRequest` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "TimeOffRequest" DROP CONSTRAINT "TimeOffRequest_userId_fkey";

-- AlterTable
ALTER TABLE "TimeOffRequest" DROP COLUMN "userId",
ADD COLUMN     "employeeId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "TimeOffRequest" ADD CONSTRAINT "TimeOffRequest_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "UserMetadata"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
