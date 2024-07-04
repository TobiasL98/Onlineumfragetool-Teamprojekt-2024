import {pgTable, uuid, varchar, time, numeric, integer} from "drizzle-orm/pg-core"

export const UserTable = pgTable("user", {
    userID: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", {length: 255}).notNull(),
})

export const PointTable = pgTable('point',{
    pointID: uuid("pointId").primaryKey().defaultRandom(),
    coordinates: varchar("coordinates", {length: 255}).notNull(),
    timestamp: time("timestamp").notNull()
})

export const RouteTable = pgTable("route", {
    routeID: uuid("routeID").primaryKey().defaultRandom(),
    userID: integer("userID").references(() => UserTable.userID),
    pointID: integer("pointID").references(() => PointTable.pointID),
  });


export const ShelfTable = pgTable("shelf", {
    shelfID: uuid("shelfID").primaryKey().defaultRandom(),
    center: varchar("center", {length: 255}).notNull(),
    height: numeric("height", {precision: 5, scale: 2}).notNull(),
    width: numeric("width", {precision: 5, scale: 2}).notNull(),
})

export const LayoutTable = pgTable("layout", {
    layoutID: uuid("layoutID").primaryKey().defaultRandom(),
    shelf1: integer("shelf1").references(() => ShelfTable.shelfID),
    shelf2: integer("shelf2").references(() => ShelfTable.shelfID),
    shelf3: integer("shelf3").references(() => ShelfTable.shelfID),
    shelf4: integer("shelf4").references(() => ShelfTable.shelfID),
    shelf5: integer("shelf5").references(() => ShelfTable.shelfID),
  });