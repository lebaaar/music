DO $$ BEGIN
 CREATE TYPE "public"."provider" AS ENUM('email', 'oauth', 'oauth_email');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "provider" "provider" NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "google_id" varchar(255);--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "authBy";