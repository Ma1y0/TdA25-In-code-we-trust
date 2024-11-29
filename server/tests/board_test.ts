import { type Board } from "@/db/schema";
import { detectEndgame } from "@/board";
import { beforeAll, describe, expect, it } from "bun:test";

beforeAll(() => {
  process.env.NODE_ENV = "test";
});

function createEmptyBoard(): Board {
  return Array(15)
    .fill(null)
    .map(() => Array(15).fill("")) as Board;
}

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

  it("Should detect diagonal win from top-right to bottom-left", () => {
    const board = createEmptyBoard();
    board[0][4] = "X";
    board[1][3] = "X";
    board[2][2] = "X";
    board[3][1] = "X";

    expect(detectEndgame(board)).toBeTrue();
  });

  it("Should detect win with empty cell before or after the winning sequence", () => {
    const board = createEmptyBoard();
    board[0][0] = "X";
    board[0][1] = "X";
    board[0][2] = "X";
    // Gap
    board[0][4] = "X";

    expect(detectEndgame(board)).toBeTrue();
  });

  it("Should not detect false positive for non-winning sequences", () => {
    const board = createEmptyBoard();
    board[0][0] = "X";
    board[0][1] = "X";
    board[0][2] = "X";

    expect(detectEndgame(board)).toBeFalse();
  });

  it("Should handle multiple players", () => {
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

  it("Should work with edge cases near board boundaries", () => {
    const board = createEmptyBoard();
    board[14][0] = "X";
    board[13][1] = "X";
    board[12][2] = "X";
    board[11][3] = "X";
    board[10][4] = "X";

    expect(detectEndgame(board)).toBeTrue();
  });
});
