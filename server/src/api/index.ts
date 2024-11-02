import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { GameUpdateSchema } from "./schema";

// /api routes
export const api = new Hono();

api.get("/", (e) => {
  return e.json({ organization: "Student Cyber Games" });
});

// Create game
api.post("/game", zValidator("json", GameUpdateSchema), (c) => {
  const body = c.req.valid("json");

  console.log(body);
  return c.json({ message: "Hello" });
});
