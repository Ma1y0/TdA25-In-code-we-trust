import { type Cell, type Board } from "@/db/schema";
import { detectEndgame } from "@/board";
import { beforeAll, describe, expect, it } from "bun:test";
import { detectGameState } from "@/gameState";

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

  return board;
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

const width = 15;
const height = 15;

describe("detectEndgame", () => {
  // Helper function to create a board
  it("Should be false on empty board", () => {
    const board = createEmptyBoard();

    // Tests
    expect(detectEndgame(board)).toBeFalse();
  });

  it("Should be true on vertical 4 in a row", () => {
    for (let i = 0; i < width; i++) {
      const board = createEmptyBoard();

      // Create a vertical line of Xs 4 long
      for (let j = 0; j <= 4; j++) {
        board[j][i] = "X";
      }

      expect(detectEndgame(board)).toBeTrue();
    }
  });

  it("Should be true on horizotal 4 in a row", () => {
    for (let i = 0; i < height; i++) {
      const board = createEmptyBoard();

      // Create a vertical line of Xs 4 long
      for (let j = 0; j <= 4; j++) {
        board[i][j] = "X";
      }

      expect(detectEndgame(board)).toBeTrue();
    }
  });

  it("Should be true on diagonal", () => {
    const board = createEmptyBoard();
    board[0][0] = "X";
    board[1][1] = "X";
    board[2][2] = "X";
    board[3][3] = "X";

    expect(detectEndgame(board)).toBeTrue();
  });

  it("Should be true on diagonal from top-right to bottom-left", () => {
    const board = createEmptyBoard();
    board[0][4] = "X";
    board[1][3] = "X";
    board[2][2] = "X";
    board[3][1] = "X";

    expect(detectEndgame(board)).toBeTrue();
  });

  it("Should be true with a gap", () => {
    const board = createEmptyBoard();
    board[0][0] = "X";
    board[0][1] = "X";
    board[0][2] = "X";
    // Gap
    board[0][4] = "X";

    expect(detectEndgame(board)).toBeTrue();
  });

  it("Should be false for non-winning sequences", () => {
    const board = createEmptyBoard();
    board[0][0] = "X";
    board[0][1] = "X";
    board[0][2] = "X";

    expect(detectEndgame(board)).toBeFalse();
  });

  it("Should be true with multiple players", () => {
    const board = createEmptyBoard();
    board[0][0] = "X";
    board[0][1] = "X";
    board[0][2] = "X";
    board[0][3] = "X";

    const oBoard = createEmptyBoard();
    oBoard[1][0] = "O";
    oBoard[1][1] = "O";
    oBoard[1][2] = "O";
    oBoard[1][3] = "O";

    expect(detectEndgame(board)).toBeTrue();
    expect(detectEndgame(oBoard)).toBeTrue();
  });

  it("Should be true in special case near board boundaries", () => {
    const board = createEmptyBoard();
    board[14][0] = "X";
    board[13][1] = "X";
    board[12][2] = "X";
    board[11][3] = "X";
    board[10][4] = "X";

    expect(detectEndgame(board)).toBeTrue();
  });
});
