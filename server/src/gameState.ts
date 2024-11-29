import { Game, GameState } from "@/db/schema";
import { detectEndgame } from "./board";

export function detectGameState(game: Game): GameState {
  if (detectEndgame(game.board)) return "endgame";
  if (game.turns <= 5) {
    return "opening";
  } else if (game.turns >= 6) {
    return "midgame";
  } else {
    return "unknown";
  }
}
