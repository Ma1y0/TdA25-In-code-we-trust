import { type Cell, type Board } from "@/db/schema";
import { detectEndgame } from "@/endgameHelpers";
import { beforeAll, describe, expect, it } from "bun:test";
import { detectGameState, whoStarted } from "@/boardHelpers";

beforeAll(() => {
  process.env.NODE_ENV = "test";
});

function createEmptyBoard(): Board {
  return Array(15)
    .fill(null)
    .map(() => Array(15).fill("")) as Board;
}

export function createMockGame(turns: number): Board {
  const board = createEmptyBoard();
  const players: Cell[] = ["X", "O"];

  for (let i = 0; i < turns; i++) {
    let placed = false;

    while (!placed) {
      const row = Math.floor(Math.random() * 15);
      const col = Math.floor(Math.random() * 15);

      if (board[row][col] === "") {
        const player = players[i % 2]; // Alternate between "X" and "O"
        board[row][col] = player;
        placed = true;
      }
    }
  }

  // In case an endgame board is generated
  return detectEndgame(board) ? createMockGame(turns) : board;
}

describe("detectGameState", () => {
  it("Should return beginning when game.turns <= 5", () => {
    const board = createMockGame(3);
    const state = detectGameState(board);

    expect(state).toBe("opening");
  });

  it("Should return midgame when game.turns >= 6", () => {
    const game = createMockGame(23);
    const state = detectGameState(game);

    expect(state).toBe("midgame");
  });

  it("Should detect endgame", () => {
    const board = createMockGame(1);
    board[0][0] = "X";
    board[1][1] = "X";
    board[2][2] = "X";
    board[3][3] = "X";

    const state = detectGameState(board);

    expect(state).toBe("endgame");
  });
});

describe("Who started", () => {
  it("Should detect X started", () => {
    const board = createEmptyBoard();

    board[0][0] = "X";

    expect(whoStarted(board)).toBe("X");
  });

  it("Should detect O started", () => {
    const board = createEmptyBoard();

    board[0][0] = "O";

    expect(whoStarted(board)).toBe("O");
  });

  it("Should detect invalid board", () => {
    const board = createEmptyBoard();

    board[0][0] = "X";
    board[0][1] = "X";

    expect(whoStarted(board)).toBeNull();
  });

  it("Should handle an empty board", () => {
    const board = createEmptyBoard();

    expect(whoStarted(board)).toBe("");
  });
});
