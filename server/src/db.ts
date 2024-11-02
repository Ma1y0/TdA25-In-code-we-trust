import { Database } from "bun:sqlite";

type Difficulty = "beginner" | "easy" | "medium" | "hard";
type GameState = "opening" | "midgame" | "endgame" | "unknown";
type Cell = "X" | "" | "O";
type Row = [Cell, ...Cell[]] & { lenght: 255 };
type Board = [Cell, ...Cell[]] & { lenght: 255 };
type UUID = `${string}-${string}-${string}-${string}-${string}`;

type Game = {
  id: UUID;
  name: String;
  difficulty: Difficulty;
  gameState: GameState;
  board: Board;
  createdAt: string;
  updatedAt: string;
};

export class DB {
  private db: Database;

  constructor() {
    this.db = new Database("db.sqlite3", { create: true, strict: true });
    this.init();
  }

  private init() {
    this.db.run(`
            CREATE TABLE IF NOT EXISTS games (
                id TEXT PRIMARY KEY,
								name TEXT NOT NULL,
                difficulty TEXT NOT NULL CHECK(difficulty IN ('beginner', 'easy', 'medium', 'hard')),
								game_state TEXT NOT NULL CHECK(game_state IN ('opening', 'midgame', 'endgame', 'unknown')),
                board TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    						updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
						);

						-- Trigger to update 'updated_at' whenever a row is updated
						CREATE TRIGGER IF NOT EXISTS update_games_updated_at
						AFTER UPDATE ON games
						FOR EACH ROW
						BEGIN
     						UPDATE games SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
						END;

						-- name index
						CREATE INDEX IF NOT EXISTS idx_games_name ON games (name);
        `);
  }

  // Creates new game
  public createGame(
    name: string,
    difficulty: Difficulty,
    board: Board = Array(255).fill(" ") as Board,
  ) {
    const id = crypto.randomUUID();

    this.db
      .query(
        "INSERT INTO games (id, name, difficulty, game_state, board) VALUES ($id, $name, $difficulty, $game_state, $board);",
      )
      .run(id, name, difficulty, "unknown", JSON.stringify(board));

    return {
      id,
      name,
      difficulty,
      board,
    };
  }

  // Retrieves game by id
  public getGameById(id: UUID): Game {
    return this.db.query("SELECT * FROM games WHERE id = $id").get(id) as Game;
  }
}

export const db = new DB();
