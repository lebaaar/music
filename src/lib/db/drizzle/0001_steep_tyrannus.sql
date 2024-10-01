ALTER TABLE "users" ADD COLUMN "authBy" varchar(255);--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "api_key";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "profile_type";