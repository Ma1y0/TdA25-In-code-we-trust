import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { GameUpdateSchema } from "./schema";
import { db } from "@/db";
import { games } from "@/db/schema";
import { eq } from "drizzle-orm";

// /api routes
export const api = new Hono();

// Get all game records
api.get("/games", async (c) => {
  // Handle this error
  // I think it's stupid to not have a limit here, but they ask for all of the games.
  const allGames = await db.select().from(games);

  return c.json(allGames);
});

// Create game record
api.post("/games", zValidator("json", GameUpdateSchema), async (c) => {
  const body = c.req.valid("json");

  // Maybe handle the error?????
  const game = await db
    .insert(games)
    .values({
      uuid: crypto.randomUUID(),
      name: body.name,
      difficulty: body.difficulty,
      board: body.board,
      gameState: "unknown",
    })
    .returning();

  return c.json(game, 201);
});

// Get game record by id
api.get("/games/:uuid", async (c) => {
  const { uuid } = c.req.param();

  // Handle this error
  const game = await db.query.games.findFirst({
    where: eq(games.uuid, uuid),
  });

  if (game == null) {
    return c.json({ code: 404, message: "Resource not found" }, 404);
  }

  return c.json(game);
});

// Updates a game record
api.put("/games/:uuid", zValidator("json", GameUpdateSchema), async (c) => {
  const { uuid } = c.req.param();
  const body = c.req.valid("json");

  // Handle this error
  const newGame = await db
    .update(games)
    .set(body)
    .where(eq(games.uuid, uuid))
    .returning();

  return c.json(newGame[0]);
});

// Deletes a game record
// eslint-disable-next-line drizzle/enforce-delete-with-where
api.delete("/games/:uuid", async (c) => {
  const { uuid } = c.req.param();

  await db.delete(games).where(eq(games.uuid, uuid));

  return c.status(204);
});
