import { integer, pgTable, text, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  wallet_address: varchar({ length: 42 }).unique().notNull(),
  name: varchar({ length: 255 }),
  bio: text().default(
    "Let collaborate and i make the best out of your work.my name is mandikis Let collaborate and i make the best out of your work",
  ),
});
