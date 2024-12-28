import { type Board, type GameState } from "@/db/schema";
import { detectEndgame } from "./endgameHelpers";

export function calculateGameTurns(board: Board): number {
  return board.flat().filter((x) => x !== "").length;
}

// Finds out which player started the game.
// "" (empty string) = The game haven't started yet
// null = The board is invalid
export function whoStarted(board: Board, nextTurn: "X" | "O") {
  const xCount = board.flat().filter((x) => x === "X").length;
  const oCount = board.flat().filter((x) => x === "O").length;

  if (nextTurn === "X" && xCount < oCount) {
    return "O";
  }

  if (nextTurn === "O" && xCount > oCount) {
    return "O";
  }

  return "X";
}

export function detectGameState(board: Board): GameState {
  if (detectEndgame(board, "X")) return "endgame";
  const turns = calculateGameTurns(board);

  if (turns <= 5) {
    return "opening";
  } else if (turns >= 6) {
    return "midgame";
  } else {
    return "unknown";
  }
}
