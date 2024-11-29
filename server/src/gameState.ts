import { type Board, type GameState } from "@/db/schema";
import { detectEndgame } from "./board";

function calculateTurns(board: Board): number {
  return board.flat().filter((x) => x !== "").length;
}

export function detectGameState(board: Board): GameState {
  if (detectEndgame(board)) return "endgame";
  const turns = calculateTurns(board);

  if (turns <= 5) {
    return "opening";
  } else if (turns >= 6) {
    return "midgame";
  } else {
    return "unknown";
  }
}
