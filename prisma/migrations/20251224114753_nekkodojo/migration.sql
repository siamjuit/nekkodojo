/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "AttachmentType" AS ENUM ('image', 'video', 'gif');

-- CreateEnum
CREATE TYPE "LikeType" AS ENUM ('like', 'dislike');

-- CreateEnum
CREATE TYPE "TagType" AS ENUM ('Discussion', 'Senseis_Wisdom', 'Guidance_Needed', 'Kata', 'Ronins_Path', 'Dojo_Life', 'Showcase', 'Dynamic_Programming', 'Graphs_n_Trees', 'Arrays_n_Strings', 'Recursion', 'Bit_Manipulation', 'System_Design', 'Math_n_Geometry', 'TypeScript_JavaScript', 'Python', 'CPP_n_C', 'Java', 'Rust', 'Gate', 'SQL', 'NoSQL', 'Frontend', 'Backend', 'Job', 'Placement');

-- CreateEnum
CREATE TYPE "BeltType" AS ENUM ('white_belt', 'yellow_belt', 'orange_belt', 'green_belt', 'blue_belt', 'purple_belt', 'brown_belt', 'black_belt');

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "beltRank" "BeltType" NOT NULL DEFAULT 'white_belt',
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "isOnboarded" BOOLEAN DEFAULT false,
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "noOfQuestionsSolved" INTEGER,
ADD COLUMN     "profileUrl" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- DropTable
DROP TABLE "Post";

-- CreateTable
CREATE TABLE "Discussions" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "tag" "TagType" NOT NULL DEFAULT 'Discussion',
    "authorId" TEXT NOT NULL,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "disLikeCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Discussions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comments" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "discussionId" TEXT NOT NULL,
    "parentId" TEXT,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "dislikeCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attachment" (
    "id" TEXT NOT NULL,
    "postUrl" TEXT NOT NULL,
    "type" "AttachmentType" NOT NULL,
    "discussionId" TEXT,
    "commentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Likes" (
    "id" TEXT NOT NULL,
    "type" "LikeType" NOT NULL,
    "discussionId" TEXT,
    "commentId" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bookmark" (
    "id" TEXT NOT NULL,
    "discussionId" TEXT,
    "commentId" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bookmark_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Discussions_tag_idx" ON "Discussions"("tag");

-- CreateIndex
CREATE UNIQUE INDEX "Attachment_commentId_key" ON "Attachment"("commentId");

-- CreateIndex
CREATE UNIQUE INDEX "Likes_userId_discussionId_key" ON "Likes"("userId", "discussionId");

-- CreateIndex
CREATE UNIQUE INDEX "Likes_userId_commentId_key" ON "Likes"("userId", "commentId");

-- CreateIndex
CREATE UNIQUE INDEX "Bookmark_userId_discussionId_key" ON "Bookmark"("userId", "discussionId");

-- CreateIndex
CREATE UNIQUE INDEX "Bookmark_userId_commentId_key" ON "Bookmark"("userId", "commentId");

-- AddForeignKey
ALTER TABLE "Discussions" ADD CONSTRAINT "Discussions_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_discussionId_fkey" FOREIGN KEY ("discussionId") REFERENCES "Discussions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Comments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_discussionId_fkey" FOREIGN KEY ("discussionId") REFERENCES "Discussions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Likes" ADD CONSTRAINT "Likes_discussionId_fkey" FOREIGN KEY ("discussionId") REFERENCES "Discussions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Likes" ADD CONSTRAINT "Likes_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Likes" ADD CONSTRAINT "Likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_discussionId_fkey" FOREIGN KEY ("discussionId") REFERENCES "Discussions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
