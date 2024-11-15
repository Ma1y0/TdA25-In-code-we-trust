import { Board } from "@/db/schema";
import { z } from "zod";

// Difficulty Schema
export const DifficultySchema = z.enum([
  "beginner",
  "easy",
  "medium",
  "hard",
  "extreme",
]);

// Board State Schema (15x15 matrix)
export const BoardSchema = z
  .array(z.array(z.enum(["X", "O", ""])).length(15))
  .length(15)
  .transform((board) => board as Board);

// Game Create/Update Request Schema
export const GameUpdateSchema = z.object({
  name: z.string().min(1),
  difficulty: DifficultySchema,
  board: BoardSchema.default(Array(15).fill(Array(15).fill(""))),
});

// Game State Enum
export const GameStateEnum = z.enum([
  "opening",
  "midgame",
  "endgame",
  "unknown",
]);

// Game Response Schema
export const GameSchema = z.object({
  uuid: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  name: z.string().min(1),
  difficulty: DifficultySchema,
  gameState: GameStateEnum,
  board: BoardSchema,
});
