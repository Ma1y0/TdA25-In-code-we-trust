import { type Board } from "@/db/schema";
import { detectEndgame } from "@/board";
import { beforeAll, describe, expect, it } from "bun:test";

beforeAll(() => {
  process.env.NODE_ENV = "test";
});

function createEmptyBoard(): Board {
  return Array(15).fill(Array(15).fill("")) as Board;
}

describe("detectEndgame", () => {
  // Helper function to create a board
  it("Empty board should be false", () => {
    const board = createEmptyBoard();

    // Tests
    expect(detectEndgame(board)).toBeFalse();
  });
});
