-- Drop existing constraints if they exist
DROP TABLE IF EXISTS "route" CASCADE;
DROP TABLE IF EXISTS "layout" CASCADE;
DROP TABLE IF EXISTS "point" CASCADE;
DROP TABLE IF EXISTS "shelf" CASCADE;
DROP TABLE IF EXISTS "supermarket" CASCADE;
DROP TABLE IF EXISTS "user" CASCADE;

CREATE TABLE IF NOT EXISTS "user" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "days" varchar(255) NOT NULL,
    "time" varchar(255) NOT NULL,
    "age" INTEGER,
    "sex" VARCHAR(10),
    "diet" VARCHAR(50),
    "occupation" VARCHAR(50),
    "buyingFor" JSONB,
    "allergies" JSONB,
    "otherAllergies" VARCHAR(255)
);
CREATE TABLE IF NOT EXISTS "point" (
    "pointId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "coordinates" varchar(255) NOT NULL,
    "timestamp" time NOT NULL
);

CREATE TABLE IF NOT EXISTS "shelf" (
    "shelfID" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "center" varchar(255) NOT NULL,
    "height" numeric(5, 2) NOT NULL,
    "width" numeric(5, 2) NOT NULL
);

CREATE TABLE IF NOT EXISTS "layout" (
    "layoutID" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "shelf1" uuid,
    "shelf2" uuid,
    "shelf3" uuid,
    "shelf4" uuid,
    "shelf5" uuid
);

CREATE TABLE IF NOT EXISTS "route" (
    "routeID" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "userID" uuid,
    "pointID" uuid
);

CREATE TABLE IF NOT EXISTS "supermarket" (
    "supermarketID" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "supermarketName" varchar(255) NOT NULL,
    "layoutID" uuid
);

-- Add constraints
ALTER TABLE "layout" ADD CONSTRAINT "layout_shelf1_shelf_shelfID_fk" FOREIGN KEY ("shelf1") REFERENCES "public"."shelf"("shelfID") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "layout" ADD CONSTRAINT "layout_shelf2_shelf_shelfID_fk" FOREIGN KEY ("shelf2") REFERENCES "public"."shelf"("shelfID") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "layout" ADD CONSTRAINT "layout_shelf3_shelf_shelfID_fk" FOREIGN KEY ("shelf3") REFERENCES "public"."shelf"("shelfID") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "layout" ADD CONSTRAINT "layout_shelf4_shelf_shelfID_fk" FOREIGN KEY ("shelf4") REFERENCES "public"."shelf"("shelfID") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "layout" ADD CONSTRAINT "layout_shelf5_shelf_shelfID_fk" FOREIGN KEY ("shelf5") REFERENCES "public"."shelf"("shelfID") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "route" ADD CONSTRAINT "route_userID_user_id_fk" FOREIGN KEY ("userID") REFERENCES "public"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "route" ADD CONSTRAINT "route_pointID_point_pointId_fk" FOREIGN KEY ("pointID") REFERENCES "public"."point"("pointId") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "supermarket" ADD CONSTRAINT "supermarket_layoutID_layout_layoutID_fk" FOREIGN KEY ("layoutID") REFERENCES "public"."layout"("layoutID") ON DELETE NO ACTION ON UPDATE NO ACTION;
