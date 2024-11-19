import { Board } from "@/db/schema";
import { Context } from "hono";
import { z } from "zod";

// TODO: figure out the type for any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function handleSchemaError(result: any, c: Context) {
  if (!result.success) {
    // Extracts all board schema cussed errors
    const boardErrors = result.error.errors.filter(
      (err: any) => err.path.includes("board") || err.path[0] === "board",
    );

    // Returns different error for board related issues
    if (boardErrors.length > 0) {
      return c.json(
        {
          code: 422,
          message: `Semantic error: ${boardErrors.map((err: { message: string }) => err.message).join(", ")}`,
        },
        422,
      );
    }

    return c.json(
      {
        code: 400,
        message: `Bad request: ${result.error}`,
      },
      400,
    );
  }
}

// Difficulty Schema
export const DifficultySchema = z.enum([
  "beginner",
  "easy",
  "medium",
  "hard",
  "extreme",
]);

// Game State Enum
export const GameStateEnum = z.enum([
  "opening",
  "midgame",
  "endgame",
  "unknown",
]);

// Board State Schema (15x15 matrix)
export const BoardSchema = z
  .array(z.array(z.enum(["X", "O", ""])).length(15))
  .length(15)
  .transform((board) => board as Board);

// Game Create/Update Request Schema
export const GameUpdateSchema = z.object({
  name: z.string().min(1),
  gameState: GameStateEnum.default("unknown"),
  difficulty: DifficultySchema,
  board: BoardSchema.default(Array(15).fill(Array(15).fill(""))),
});

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
