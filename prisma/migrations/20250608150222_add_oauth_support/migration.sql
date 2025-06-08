/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `accounts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[oauth_provider,oauth_id]` on the table `accounts` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "accounts_username_key";

-- AlterTable
ALTER TABLE "accounts" ADD COLUMN     "avatar_url" VARCHAR(500),
ADD COLUMN     "email" VARCHAR(255),
ADD COLUMN     "oauth_id" VARCHAR(255),
ADD COLUMN     "oauth_provider" VARCHAR(50),
ALTER COLUMN "password" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "accounts_email_key" ON "accounts"("email");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_oauth_provider_oauth_id_key" ON "accounts"("oauth_provider", "oauth_id");
