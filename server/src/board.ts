import { type Board, Cell } from "@/db/schema";

const winLen = 5;
const players = ["X", "O"] as const;

export function detectEndgame(board: Board): boolean {
  for (const player of players) {
    // The lines
    for (const row of board) {
      if (canCompleteLine(row, player)) return true;
    }

    // The columns
    for (let col = 0; col < board[0].length; col++) {
      if (canCompleteLine(getColumn(board, col), player)) return true;
    }

    // The diagonals
    for (let col = 0; col < board[0].length; col++) {
      if (canCompleteLine(getColumn(board, col), player)) return true;
    }

    // Check diagonals (top-left to bottom-right)
    // Start from leftmost column
    for (let col = 0; col < board[0].length; col++) {
      const diagonal = getDiagonalTLBR(board, 0, col);
      if (diagonal.length >= 5 && canCompleteLine(diagonal, player))
        return true;
    }
    // Start from top row (except first column)
    for (let row = 1; row < board.length; row++) {
      const diagonal = getDiagonalTLBR(board, row, 0);
      if (diagonal.length >= 5 && canCompleteLine(diagonal, player))
        return true;
    }

    // Check diagonals (top-right to bottom-left)
    // Start from rightmost column
    for (let col = board[0].length - 1; col >= 0; col--) {
      const diagonal = getDiagonalTRBL(board, 0, col);
      if (diagonal.length >= 5 && canCompleteLine(diagonal, player))
        return true;
    }
    // Start from top row (except last column)
    for (let row = 1; row < board.length; row++) {
      const diagonal = getDiagonalTRBL(board, row, board[0].length - 1);
      if (diagonal.length >= 5 && canCompleteLine(diagonal, player))
        return true;
    }
  }

  return false;
}

// Get diagonal starting from top-left to bottom-right
function getDiagonalTLBR(board: Board, row: number, col: number): Cell[] {
  const diagonal: Cell[] = [];

  while (row < board.length && col < board[0].length) {
    diagonal.push(board[row][col]);
    row++;
    col++;
  }

  return diagonal;
}

// Get diagonal starting from top-right to bottom-left
function getDiagonalTRBL(board: Board, row: number, col: number): Cell[] {
  const diagonal: Cell[] = [];

  while (row < board.length && col >= 0) {
    diagonal.push(board[row][col]);
    row++;
    col--;
  }

  return diagonal;
}

function getColumn(board: Board, i: number): Cell[] {
  return board.map((row) => row[i]);
}

function canCompleteLine(row: Cell[], player: "X" | "O"): boolean {
  for (let i = 0; i <= row.length - winLen; i++) {
    const window = row.slice(i, i + winLen);
    const playerCells = window.filter((x) => x === player).length;
    const emptyCells = window.filter((x) => x === "").length;

    if (playerCells === winLen - 1 && emptyCells === 1) {
      return true;
    }
  }

  return false;
}
