import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import * as schema from "./schema";

// Creates DB "connection" based on the environment
function createDB() {
  if (process.env.NODE_ENV === "test") {
    return new Database(":memory:");
  } else {
    return new Database(process.env.DB!);
  }
}

export async function resetDB() {
  // ???
}

export const db = drizzle(createDB(), { schema });
