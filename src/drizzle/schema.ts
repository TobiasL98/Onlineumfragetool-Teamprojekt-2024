import { pgTable, uuid, varchar, jsonb, integer, text, numeric } from "drizzle-orm/pg-core";

// Supermarket Table
export const SupermarketTable = pgTable("supermarket", {
  supermarketID: uuid("supermarketID").primaryKey().defaultRandom(),
  layout: text("layout"),  // JSON as string
  user: text("user")  // JSON as string
});

// User Table
export const UserTable = pgTable("user", {
  userID: uuid("userID").primaryKey().defaultRandom(),
  route: text("route")  // JSON as string
});

// Route Table
export const RouteTable = pgTable("route", {
  routeID: uuid("routeID").primaryKey().defaultRandom(),
  shelfID: uuid("shelfID").references(() => ShelfTable.shelfID),
  checkoutID: uuid("checkoutID"),
  shoppingTime: varchar("shoppingTime", { length: 255 }),
  shoppingOrder: integer("shoppingOrder")
});

// Shelf Table
export const ShelfTable = pgTable("shelf", {
  shelfID: uuid("shelfID").primaryKey().defaultRandom(),
  center: varchar("center", { length: 255 }).notNull(),
  height: numeric("height", { precision: 5, scale: 2 }).notNull(),
  width: numeric("width", { precision: 5, scale: 2 }).notNull()
});