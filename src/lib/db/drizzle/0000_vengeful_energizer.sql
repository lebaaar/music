CREATE TABLE IF NOT EXISTS "gyms" (
	"gym_id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"location" varchar(255),
	"created_date" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "notifications" (
	"notification_id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"gym_id" integer,
	"title" varchar(255),
	"description" varchar(255),
	"time" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "song_requests" (
	"song_request_id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"gym_id" integer,
	"song_title" varchar(255),
	"artist_name" varchar(255),
	"status" varchar(50),
	"request_timestamp" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"user_id" serial PRIMARY KEY NOT NULL,
	"display_name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"joined_date" timestamp NOT NULL,
	"api_key" text,
	"profile_type" integer,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notifications" ADD CONSTRAINT "notifications_gym_id_gyms_gym_id_fk" FOREIGN KEY ("gym_id") REFERENCES "public"."gyms"("gym_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "song_requests" ADD CONSTRAINT "song_requests_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "song_requests" ADD CONSTRAINT "song_requests_gym_id_gyms_gym_id_fk" FOREIGN KEY ("gym_id") REFERENCES "public"."gyms"("gym_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
