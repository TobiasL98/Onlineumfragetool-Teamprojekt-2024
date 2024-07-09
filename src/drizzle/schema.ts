import { pgTable, uuid, varchar, json, jsonb, integer, text, numeric } from "drizzle-orm/pg-core";
import { routeModule } from "next/dist/build/templates/app-page";

// Supermarket Table
export const SupermarketTable = pgTable("supermarket", {
  supermarketID: uuid("supermarketID").primaryKey().defaultRandom(),
  layout: json("layout"),  // JSON as string
});

// User Table
export const UserTable = pgTable("user", {
  userID: uuid("id").primaryKey().defaultRandom(),
  supermarketID: uuid("supermarketID").references(() => SupermarketTable.supermarketID),
  days: varchar("days", { length: 255 }),  // JSON Array
  time: varchar("time", { length: 255 }),
  age: integer("age"),
  sex: varchar("sex", { length: 255 }),
  diet: varchar("diet", { length: 255 }),
  occupation: varchar("occupation", { length: 255 }),
  buyingFor: jsonb("buyingFor"),
  allergies: jsonb("allergies"),
  otherAllergies: varchar("otherAllergies", { length: 255 }),
});

// Route Table
export const RouteTable = pgTable("route", {
  routeID: uuid("routeID").primaryKey().defaultRandom(),
  shelfID: uuid("shelfID"),
  checkoutID: uuid("checkoutID"),
  shoppingTime: varchar("shoppingTime", { length: 255 }),
  shoppingOrder: integer("shoppingOrder"),
  userID: uuid("UserID").references(() => UserTable.userID),
});
