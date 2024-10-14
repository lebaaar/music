ALTER TABLE "users" ADD COLUMN "gym_id" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_gym_id_gyms_gym_id_fk" FOREIGN KEY ("gym_id") REFERENCES "public"."gyms"("gym_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
