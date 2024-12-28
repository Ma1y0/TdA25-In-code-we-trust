import { type Cell, type Board, type Row } from "@/db/schema";
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
  return detectEndgame(board, "X") || detectEndgame(board, "O")
    ? createMockGame(turns)
    : board;
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

describe("whoStarted()", () => {
  it("Should recognize that X started when it's X turn", () => {
    const board = createEmptyBoard();
    board[0][0] = "X";
    board[1][1] = "X";
    board[2][0] = "O";
    board[2][2] = "O";

    expect(whoStarted(board, "X")).toBe("X");
  });
});

describe("detectEndgame())", () => {
  // Helper to create an empty board
  function createEmptyBoard(): Board {
    return Array(15)
      .fill(null)
      .map(() => Array(15).fill("") as Row) as Board;
  }

  it("Should detect horizontal winning move", () => {
    const board = createEmptyBoard();
    // Set up XXXX_ pattern
    board[7][5] = "X";
    board[7][6] = "X";
    board[7][7] = "X";
    board[7][8] = "X";

    expect(detectEndgame(board, "X")).toBe(true);
  });

  it("Should detect vertical winning move", () => {
    const board = createEmptyBoard();
    // Set up vertical XXXX_ pattern
    board[4][7] = "X";
    board[5][7] = "X";
    board[6][7] = "X";
    board[7][7] = "X";

    expect(detectEndgame(board, "X")).toBe(true);
  });

  it("Should detect diagonal winning move", () => {
    const board = createEmptyBoard();
    // Set up diagonal XXXX_ pattern
    board[3][3] = "X";
    board[4][4] = "X";
    board[5][5] = "X";
    board[6][6] = "X";

    expect(detectEndgame(board, "X")).toBe(true);
  });

  it("Should not detect win when sequence is blocked by opponent", () => {
    const board = createEmptyBoard();
    // Set up XXXXO pattern (blocked by opponent)
    board[7][5] = "X";
    board[7][6] = "X";
    board[7][7] = "X";
    board[7][8] = "X";
    board[7][9] = "O";

    expect(detectEndgame(board, "X")).toBe(false);
  });

  it("Should not detect win when sequence is blocked by wall", () => {
    const board = createEmptyBoard();
    // Set up XXXX pattern at edge of board
    board[14][11] = "X";
    board[14][12] = "X";
    board[14][13] = "X";
    board[14][14] = "X";

    expect(detectEndgame(board, "X")).toBe(false);
  });

  it("Should detect win for O player", () => {
    const board = createEmptyBoard();
    // Set up OOOO_ pattern
    board[7][5] = "O";
    board[7][6] = "O";
    board[7][7] = "O";
    board[7][8] = "O";

    expect(detectEndgame(board, "O")).toBe(true);
  });

  it("Should not detect win when there are only 3 symbols in a row", () => {
    const board = createEmptyBoard();
    // Set up XXX_ pattern
    board[7][5] = "X";
    board[7][6] = "X";
    board[7][7] = "X";

    expect(detectEndgame(board, "X")).toBe(false);
  });

  it("Should not detect win when there are gaps between symbols", () => {
    const board = createEmptyBoard();
    // Set up XX_XX pattern
    board[7][5] = "X";
    board[7][6] = "X";
    board[7][8] = "X";
    board[7][9] = "X";

    expect(detectEndgame(board, "X")).toBe(false);
  });
});
