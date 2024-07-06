import { pgTable, uuid, varchar, time, numeric } from "drizzle-orm/pg-core";

export const UserTable = pgTable("user", {
  userID: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(), 
  days: varchar("days", { length: 255 }).array(),  // Array für die Tage
  time: varchar("time", { length: 255 })
});

export const PointTable = pgTable("point", {
  pointID: uuid("pointId").primaryKey().defaultRandom(),
  coordinates: varchar("coordinates", { length: 255 }).notNull(),
  timestamp: time("timestamp").notNull(),
});

export const RouteTable = pgTable("route", {
  routeID: uuid("routeID").primaryKey().defaultRandom(),
  userID: uuid("userID").references(() => UserTable.userID),
  pointID: uuid("pointID").references(() => PointTable.pointID),
});

export const ShelfTable = pgTable("shelf", {
  shelfID: uuid("shelfID").primaryKey().defaultRandom(),
  center: varchar("center", { length: 255 }).notNull(),
  height: numeric("height", { precision: 5, scale: 2 }).notNull(),
  width: numeric("width", { precision: 5, scale: 2 }).notNull(),
});

export const LayoutTable = pgTable("layout", {
  layoutID: uuid("layoutID").primaryKey().defaultRandom(),
  shelf1: uuid("shelf1").references(() => ShelfTable.shelfID),
  shelf2: uuid("shelf2").references(() => ShelfTable.shelfID),
  shelf3: uuid("shelf3").references(() => ShelfTable.shelfID),
  shelf4: uuid("shelf4").references(() => ShelfTable.shelfID),
  shelf5: uuid("shelf5").references(() => ShelfTable.shelfID),
});

export const SupermarketTable = pgTable("supermarket", {
  supermarketID: uuid("supermarketID").primaryKey().defaultRandom(),
  supermarketName: varchar("supermarketName", { length: 255 }).notNull(),
  layoutID: uuid("layoutID").references(() => LayoutTable.layoutID),
});
