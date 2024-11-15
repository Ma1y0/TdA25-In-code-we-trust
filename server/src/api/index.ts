import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { GameUpdateSchema } from "./schema";
import { db } from "@/db";
import { games } from "@/db/schema";

// /api routes
export const api = new Hono();

api.get("/", (e) => {
  return e.json({ organization: "Student Cyber Games" });
});

// Create game
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

  return c.json(game[0], 201);
});
