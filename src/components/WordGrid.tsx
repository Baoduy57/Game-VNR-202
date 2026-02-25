"use client";

import { GridCell } from "@/types/game";
import { useState } from "react";

interface WordGridProps {
  grid: GridCell[][];
  onWordFound: (cells: GridCell[]) => void;
}

export default function WordGrid({ grid, onWordFound }: WordGridProps) {
  const [selectedCells, setSelectedCells] = useState<GridCell[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);

  const handleMouseDown = (cell: GridCell) => {
    setIsSelecting(true);
    setSelectedCells([cell]);
  };

  const handleMouseEnter = (cell: GridCell) => {
    if (!isSelecting) return;

    // Nếu chưa có ô nào được chọn
    if (selectedCells.length === 0) {
      setSelectedCells([cell]);
      return;
    }

    // Nếu đã có ô được chọn, kiểm tra xem có tạo thành đường thẳng không
    const firstCell = selectedCells[0];
    const rowDiff = cell.row - firstCell.row;
    const colDiff = cell.col - firstCell.col;

    // Kiểm tra có phải đường thẳng không
    const isValidDirection =
      rowDiff === 0 || // Ngang
      colDiff === 0 || // Dọc
      Math.abs(rowDiff) === Math.abs(colDiff); // Chéo

    if (!isValidDirection) return;

    // Tính toán các ô trong đường đi
    const steps = Math.max(Math.abs(rowDiff), Math.abs(colDiff));
    const rowStep = rowDiff === 0 ? 0 : rowDiff / steps;
    const colStep = colDiff === 0 ? 0 : colDiff / steps;

    const newSelectedCells: GridCell[] = [];
    for (let i = 0; i <= steps; i++) {
      const row = firstCell.row + Math.round(i * rowStep);
      const col = firstCell.col + Math.round(i * colStep);
      newSelectedCells.push(grid[row][col]);
    }

    setSelectedCells(newSelectedCells);
  };

  const handleMouseUp = () => {
    if (selectedCells.length > 1) {
      onWordFound(selectedCells);
    }
    setIsSelecting(false);
    setSelectedCells([]);
  };

  const isCellSelected = (cell: GridCell): boolean => {
    return selectedCells.some((c) => c.row === cell.row && c.col === cell.col);
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Tìm từ trên lưới
      </h2>

      <div
        className="inline-block bg-white p-2 rounded-lg shadow-lg select-none"
        onMouseLeave={() => {
          if (isSelecting) {
            handleMouseUp();
          }
        }}
      >
        <div
          className="grid gap-0.5"
          style={{
            gridTemplateColumns: `repeat(${grid.length}, minmax(0, 1fr))`,
          }}
        >
          {grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                onMouseDown={() => handleMouseDown(cell)}
                onMouseEnter={() => handleMouseEnter(cell)}
                onMouseUp={handleMouseUp}
                className={`
                  w-7 h-7 flex items-center justify-center
                  border-2 rounded cursor-pointer
                  font-semibold text-base transition-all
                  ${
                    cell.isFound
                      ? "bg-green-400 border-green-600 text-white"
                      : isCellSelected(cell)
                        ? "bg-blue-400 border-blue-600 text-white scale-110"
                        : "bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100"
                  }
                `}
              >
                {cell.letter}
              </div>
            )),
          )}
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-600 text-center max-w-md">
        <p>💡 Hướng dẫn: Nhấn và kéo chuột qua các chữ cái để tìm từ</p>
        <p className="mt-1">
          Chỉ có thể tìm từ theo hướng ngang, dọc hoặc chéo
        </p>
      </div>
    </div>
  );
}
