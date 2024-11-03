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
api.post("/game", zValidator("json", GameUpdateSchema), async (c) => {
  const body = c.req.valid("json");

  // Maybe handle the error?????
  await db.insert(games).values({
    id: crypto.randomUUID(),
    name: body.name,
    difficulty: body.difficulty,
    board: body.board,
    gameState: "unknown",
  });

  return c.json({ message: "Hello" });
});
