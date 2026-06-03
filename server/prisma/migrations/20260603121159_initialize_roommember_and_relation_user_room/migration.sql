/*
  Warnings:

  - You are about to drop the column `roomId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[inviteCode]` on the table `Room` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `creatorId` to the `Room` table without a default value. This is not possible if the table is not empty.
  - The required column `inviteCode` was added to the `Room` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_roomId_fkey";

-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "creatorId" TEXT NOT NULL,
ADD COLUMN     "inviteCode" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "roomId";

-- CreateTable
CREATE TABLE "RoomMember" (
    "id" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "roomId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "RoomMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Room_inviteCode_key" ON "Room"("inviteCode");

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomMember" ADD CONSTRAINT "RoomMember_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomMember" ADD CONSTRAINT "RoomMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
