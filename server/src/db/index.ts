import { drizzle } from "drizzle-orm/bun-sqlite";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { Database } from "bun:sqlite";
import * as schema from "./schema";

// Creates DB "connection" based on the environment
function createDB() {
  if (process.env.NODE_ENV === "test") {
    console.log("Created in :memory: db");
    return new Database(":memory:");
  } else {
    return new Database(process.env.DB!);
  }
}

export async function resetDB() {
  // eslint-disable-next-line drizzle/enforce-delete-with-where
  await db.delete(schema.games);
}

export const db = drizzle(createDB(), { schema });

// Auto migration
migrate(db, { migrationsFolder: "./drizzle" });
