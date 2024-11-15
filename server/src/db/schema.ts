import { sql } from "drizzle-orm";
import { index, sqliteTable, text } from "drizzle-orm/sqlite-core";

// Game
const difficulty = ["beginner", "easy", "medium", "hard", "extreme"] as const;
const gameState = ["opening", "midgame", "endgame", "unknown"] as const;

export type Cell = "X" | "O" | "";
export type Row = [Cell, ...Cell[]] & { length: 15 };
export type Board = [Row, ...Row[]] & { length: 15 };

export const games = sqliteTable(
  "games",
  {
    uuid: text("uuid").primaryKey(),
    name: text("name").notNull(),
    difficulty: text("difficulty", { enum: difficulty }).notNull(),
    gameState: text("game_state", { enum: gameState }).notNull(),
    board: text("board", {
      mode: "json",
    })
      .notNull()
      .$type<Board>(),
    createdAt: text()
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: text()
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => ({
    nameIdx: index("idx_games_name").on(table.name),
  }),
);
