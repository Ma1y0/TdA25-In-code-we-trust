import type { Cell, Board } from "@/db/schema";

function isInBounds(row: number, col: number): boolean {
  return row >= 0 && row < 15 && col >= 0 && col < 15;
}

function getCell(board: Board, row: number, col: number): Cell {
  if (!isInBounds(row, col)) return "";
  return board[row][col];
}

// Find continuous sequence of player's symbols
function findContinuousSequence(
  board: Board,
  startRow: number,
  startCol: number,
  rowDir: number,
  colDir: number,
  nextTurn: "X" | "O",
): { count: number; emptyPos: [number, number] | null } {
  let count = 0;
  let emptyPos: [number, number] | null = null;
  let foundEmpty = false;

  // Check up to 5 positions
  for (let i = 0; i < 5; i++) {
    const row = startRow + i * rowDir;
    const col = startCol + i * colDir;

    if (!isInBounds(row, col)) break;

    const cell = board[row][col];

    if (cell === nextTurn) {
      if (foundEmpty) return { count: 0, emptyPos: null }; // Not continuous
      count++;
    } else if (cell === "") {
      if (foundEmpty) return { count: 0, emptyPos: null }; // Multiple empty spaces
      foundEmpty = true;
      emptyPos = [row, col];
    } else {
      break; // Opponent's symbol
    }
  }

  return { count, emptyPos };
}

function isWinnableSequence(
  board: Board,
  startRow: number,
  startCol: number,
  rowDir: number,
  colDir: number,
  nextTurn: "X" | "O",
): boolean {
  const opponent = nextTurn === "X" ? "O" : "X";

  // Find continuous sequence
  const { count, emptyPos } = findContinuousSequence(
    board,
    startRow,
    startCol,
    rowDir,
    colDir,
    nextTurn,
  );

  // Must have exactly 4 symbols and one empty position
  if (count !== 4 || !emptyPos) return false;

  // Check if sequence is blocked
  const [emptyRow, emptyCol] = emptyPos;
  const beforeRow = startRow - rowDir;
  const beforeCol = startCol - colDir;
  const afterRow = emptyRow + rowDir;
  const afterCol = emptyCol + colDir;

  // Check positions before and after the sequence
  const beforeCell = getCell(board, beforeRow, beforeCol);
  const afterCell = getCell(board, afterRow, afterCol);

  // If both ends are blocked (by opponent or wall), sequence is not winnable
  const isBlockedBefore =
    beforeCell === opponent || !isInBounds(beforeRow, beforeCol);
  const isBlockedAfter =
    afterCell === opponent || !isInBounds(afterRow, afterCol);

  return !(isBlockedBefore && isBlockedAfter);
}

export function detectEndgame(board: Board, nextTurn: "X" | "O"): boolean {
  // Check all possible starting positions
  for (let row = 0; row < 15; row++) {
    for (let col = 0; col < 15; col++) {
      // Check horizontal sequences
      if (isWinnableSequence(board, row, col, 0, 1, nextTurn)) return true;

      // Check vertical sequences
      if (isWinnableSequence(board, row, col, 1, 0, nextTurn)) return true;

      // Check diagonal sequences (top-left to bottom-right)
      if (isWinnableSequence(board, row, col, 1, 1, nextTurn)) return true;

      // Check diagonal sequences (top-right to bottom-left)
      if (isWinnableSequence(board, row, col, 1, -1, nextTurn)) return true;
    }
  }

  return false;
}
