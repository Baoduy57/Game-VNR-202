import { GridCell, WordPosition, Direction, Question } from "@/types/game";

const GRID_SIZE = 20;
const DIRECTIONS: Direction[] = [
  "horizontal",
  "vertical",
  "diagonal",
  "diagonal-reverse",
];

// Tạo lưới trống
export function createEmptyGrid(size: number = GRID_SIZE): GridCell[][] {
  const grid: GridCell[][] = [];
  for (let row = 0; row < size; row++) {
    grid[row] = [];
    for (let col = 0; col < size; col++) {
      grid[row][col] = {
        letter: "",
        row,
        col,
        isPartOfWord: false,
        isFound: false,
        isSelected: false,
      };
    }
  }
  return grid;
}

// Kiểm tra xem có thể đặt từ tại vị trí này không
function canPlaceWord(
  grid: GridCell[][],
  word: string,
  startRow: number,
  startCol: number,
  direction: Direction,
): boolean {
  const size = grid.length;
  const wordLength = word.length;

  for (let i = 0; i < wordLength; i++) {
    let row = startRow;
    let col = startCol;

    switch (direction) {
      case "horizontal":
        col += i;
        break;
      case "vertical":
        row += i;
        break;
      case "diagonal":
        row += i;
        col += i;
        break;
      case "diagonal-reverse":
        row += i;
        col -= i;
        break;
    }

    // Kiểm tra tràn lưới
    if (row < 0 || row >= size || col < 0 || col >= size) {
      return false;
    }

    // Kiểm tra xung đột với chữ cái đã có (nếu có chữ cái và khác với chữ cái cần đặt)
    const existingLetter = grid[row][col].letter;
    if (existingLetter !== "" && existingLetter !== word[i]) {
      return false;
    }
  }

  return true;
}

// Đặt từ vào lưới
function placeWord(
  grid: GridCell[][],
  word: string,
  startRow: number,
  startCol: number,
  direction: Direction,
): void {
  const wordLength = word.length;

  for (let i = 0; i < wordLength; i++) {
    let row = startRow;
    let col = startCol;

    switch (direction) {
      case "horizontal":
        col += i;
        break;
      case "vertical":
        row += i;
        break;
      case "diagonal":
        row += i;
        col += i;
        break;
      case "diagonal-reverse":
        row += i;
        col -= i;
        break;
    }

    grid[row][col].letter = word[i];
    grid[row][col].isPartOfWord = true;
  }
}

// Thử đặt từ vào lưới với nhiều lần thử
function tryPlaceWord(
  grid: GridCell[][],
  word: string,
  maxAttempts: number = 300,
): WordPosition | null {
  const size = grid.length;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const direction = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
    const startRow = Math.floor(Math.random() * size);
    const startCol = Math.floor(Math.random() * size);

    if (canPlaceWord(grid, word, startRow, startCol, direction)) {
      placeWord(grid, word, startRow, startCol, direction);
      return {
        word,
        startRow,
        startCol,
        direction,
      };
    }
  }

  return null;
}

// Điền chữ cái ngẫu nhiên vào các ô trống
function fillEmptyCells(grid: GridCell[][]): void {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const size = grid.length;

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (grid[row][col].letter === "") {
        grid[row][col].letter =
          letters[Math.floor(Math.random() * letters.length)];
      }
    }
  }
}

// Hàm chính: Tạo lưới từ danh sách câu hỏi
export function generateGrid(questions: Question[]): {
  grid: GridCell[][];
  wordPositions: WordPosition[];
} {
  const grid = createEmptyGrid();
  const wordPositions: WordPosition[] = [];

  // Đặt tất cả các đáp án vào lưới
  for (const question of questions) {
    const word = question.answer.toUpperCase().replace(/\s/g, ""); // Loại bỏ khoảng trắng
    const position = tryPlaceWord(grid, word);

    if (position) {
      wordPositions.push(position);
    } else {
      console.warn(`Không thể đặt từ: ${word}`);
    }
  }

  // Điền chữ cái ngẫu nhiên vào các ô trống
  fillEmptyCells(grid);

  return { grid, wordPositions };
}

// Lấy các ô theo đường đi từ start đến end
export function getCellsInPath(
  grid: GridCell[][],
  startCell: GridCell,
  endCell: GridCell,
): GridCell[] {
  const cells: GridCell[] = [];
  const rowDiff = endCell.row - startCell.row;
  const colDiff = endCell.col - startCell.col;

  // Kiểm tra có phải đường thẳng không (ngang, dọc, hoặc chéo)
  if (
    rowDiff !== 0 &&
    colDiff !== 0 &&
    Math.abs(rowDiff) !== Math.abs(colDiff)
  ) {
    return []; // Không phải đường thẳng hợp lệ
  }

  const steps = Math.max(Math.abs(rowDiff), Math.abs(colDiff));
  const rowStep = rowDiff === 0 ? 0 : rowDiff / steps;
  const colStep = colDiff === 0 ? 0 : colDiff / steps;

  for (let i = 0; i <= steps; i++) {
    const row = startCell.row + Math.round(i * rowStep);
    const col = startCell.col + Math.round(i * colStep);
    cells.push(grid[row][col]);
  }

  return cells;
}

// Kiểm tra từ có khớp không
export function checkWord(
  cells: GridCell[],
  unlockedWords: string[],
): string | null {
  const word = cells.map((cell) => cell.letter).join("");
  const reversedWord = word.split("").reverse().join("");

  // Kiểm tra từ thuận và nghịch
  if (unlockedWords.includes(word)) {
    return word;
  }
  if (unlockedWords.includes(reversedWord)) {
    return reversedWord;
  }

  return null;
}
