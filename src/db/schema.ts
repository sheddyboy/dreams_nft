import { sql } from "drizzle-orm";
import { integer, pgTable, text, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  wallet_address: varchar({ length: 42 }).unique().notNull(),
  name: varchar({ length: 255 }).default(""),
  artist_type: varchar({ length: 255 }).default(""),
  bio: text().default(
    "Let collaborate and i make the best out of your work.my name is mandikis Let collaborate and i make the best out of your work",
  ),
  styles: text()
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
});
