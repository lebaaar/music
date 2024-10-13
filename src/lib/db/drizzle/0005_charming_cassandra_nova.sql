ALTER TABLE "users" ALTER COLUMN "password" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "gyms" ADD COLUMN "email" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "gyms" ADD COLUMN "password" text;--> statement-breakpoint
ALTER TABLE "gyms" ADD COLUMN "is_verified" boolean NOT NULL;--> statement-breakpoint
ALTER TABLE "gyms" ADD CONSTRAINT "gyms_email_unique" UNIQUE("email");