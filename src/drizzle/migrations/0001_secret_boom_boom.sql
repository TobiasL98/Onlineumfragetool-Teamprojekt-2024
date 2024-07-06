CREATE TABLE IF NOT EXISTS "layout" (
	"layoutID" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"shelf1" integer,
	"shelf2" integer,
	"shelf3" integer,
	"shelf4" integer,
	"shelf5" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "point" (
	"pointId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"coordinates" varchar(255) NOT NULL,
	"timestamp" time NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "route" (
	"routeID" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userID" integer,
	"pointID" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "shelf" (
	"shelfID" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"center" varchar(255) NOT NULL,
	"height" numeric(5, 2) NOT NULL,
	"width" numeric(5, 2) NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "layout" ADD CONSTRAINT "layout_shelf1_shelf_shelfID_fk" FOREIGN KEY ("shelf1") REFERENCES "public"."shelf"("shelfID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "layout" ADD CONSTRAINT "layout_shelf2_shelf_shelfID_fk" FOREIGN KEY ("shelf2") REFERENCES "public"."shelf"("shelfID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "layout" ADD CONSTRAINT "layout_shelf3_shelf_shelfID_fk" FOREIGN KEY ("shelf3") REFERENCES "public"."shelf"("shelfID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "layout" ADD CONSTRAINT "layout_shelf4_shelf_shelfID_fk" FOREIGN KEY ("shelf4") REFERENCES "public"."shelf"("shelfID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "layout" ADD CONSTRAINT "layout_shelf5_shelf_shelfID_fk" FOREIGN KEY ("shelf5") REFERENCES "public"."shelf"("shelfID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "route" ADD CONSTRAINT "route_userID_user_id_fk" FOREIGN KEY ("userID") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "route" ADD CONSTRAINT "route_pointID_point_pointId_fk" FOREIGN KEY ("pointID") REFERENCES "public"."point"("pointId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
