drop table "route";
drop table "user";
drop table "supermarket";


CREATE TABLE IF NOT EXISTS "route" (
	"routeID" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"shelfID" varchar(255),
	"checkoutID" varchar(255),
	"shoppingTime" varchar(500),
	"shoppingOrder" varchar(255),
	"id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "supermarket" (
	"supermarketID" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"layout" json
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"supermarketID" uuid,
	"days" varchar(255),
	"time" varchar(255),
	"age" integer,
	"sex" varchar(255),
	"diet" varchar(255),
	"occupation" varchar(255),
	"buyingFor" jsonb,
	"allergies" jsonb,
	"otherAllergies" varchar(255)
);
--> statement-breakpoint
 ALTER TABLE "route" ADD CONSTRAINT "route_id_user_id_fk" FOREIGN KEY ("id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
 ALTER TABLE "user" ADD CONSTRAINT "user_supermarketID_supermarket_supermarketID_fk" FOREIGN KEY ("supermarketID") REFERENCES "public"."supermarket"("supermarketID") ON DELETE no action ON UPDATE no action;
