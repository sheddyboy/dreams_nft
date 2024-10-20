"use server";

import db from "@/db";
import { usersTable } from "@/db/schema";
import { dataObject, errorObject } from "@/utils";
import { eq } from "drizzle-orm";

export async function checkAndAddToDb({ wallet }: { wallet: string }) {
  try {
    const [existingUser] = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.wallet_address, wallet));
    if (existingUser)
      return dataObject({ user: existingUser, type: "existing" });
    const [newUser] = await db
      .insert(usersTable)
      .values({ wallet_address: wallet })
      .returning();
    return dataObject({ user: newUser, type: "new" });
  } catch (error) {
    return errorObject(error);
  }
}

export async function getUser({ wallet }: { wallet: string }) {
  try {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.wallet_address, wallet));
    if (user) return dataObject(user);

    return errorObject(new Error("User not found"));
  } catch (error) {
    return errorObject(error);
  }
}
export async function updateUser({
  wallet,
  bio,
  name,
  styles,
  type,
}: {
  wallet: string;
  name: string;
  bio: string;
  type: string;
  styles: string[];
}) {
  try {
    await db
      .update(usersTable)
      .set({ bio, name, styles, artist_type: type })
      .where(eq(usersTable.wallet_address, wallet));
    return dataObject(true);
  } catch (error) {
    return errorObject(error);
  }
}
