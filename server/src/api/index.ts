import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { GameUpdateSchema, handleSchemaError } from "./schema";
import { db } from "@/db";
import { games } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

// /api routes
export const api = new Hono();

// Get all game records
api.get("/games", async (c) => {
  // Handle this error
  // I think a limit should be here, but they ask for all of the games.
  const allGames = await db.select().from(games);

  return c.json(allGames);
});

// Create game record
api.post(
  "/games",
  zValidator("json", GameUpdateSchema, handleSchemaError),
  async (c) => {
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

    return c.json(game[0], 201);
  },
);

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
api.put(
  "/games/:uuid",
  zValidator("json", GameUpdateSchema, handleSchemaError),
  async (c) => {
    const { uuid } = c.req.param();
    const body = c.req.valid("json");

    // Handle this error
    const newGame = await db
      .update(games)
      .set({
        name: body.name,
        difficulty: body.difficulty,
        board: body.board,
        gameState: "unknown",
        turns: sql`${games.turns} + 1`,
      })
      .where(eq(games.uuid, uuid))
      .returning();

    // Returns 404 if the game doesn't exist
    if (newGame.length == 0) {
      return c.json(
        {
          code: 404,
          message: "Resource not found",
        },
        404,
      );
    }

    // Returns the updated game record
    return c.json(newGame[0]);
  },
);

// Deletes a game record
// eslint-disable-next-line drizzle/enforce-delete-with-where
api.delete("/games/:uuid", async (c) => {
  const { uuid } = c.req.param();

  const res = await db.delete(games).where(eq(games.uuid, uuid)).returning({
    uuid: games.uuid,
  });

  if (res.length == 0) {
    return c.json(
      {
        code: 404,
        message: "Resource not found",
      },
      404,
    );
  }

  return c.text("", 204);
});
