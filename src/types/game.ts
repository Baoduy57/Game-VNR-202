// Định nghĩa các types cho game
export type Direction =
  | "horizontal"
  | "vertical"
  | "diagonal"
  | "diagonal-reverse";

export interface Question {
  id: number;
  question: string;
  answer: string;
  isAnswered: boolean;
  isFound: boolean;
}

export interface GridCell {
  letter: string;
  row: number;
  col: number;
  isPartOfWord: boolean;
  isFound: boolean;
  isSelected: boolean;
}

export interface WordPosition {
  word: string;
  startRow: number;
  startCol: number;
  direction: Direction;
}

export interface GameState {
  questions: Question[];
  grid: GridCell[][];
  wordPositions: WordPosition[];
  selectedCells: GridCell[];
  score: number;
  isCompleted: boolean;
}

export type TeamId = 1 | 2;

export interface TeamState {
  id: TeamId;
  name: string;
  questions: Question[];
  grid: GridCell[][];
  wordPositions: WordPosition[];
  score: number;
  isCompleted: boolean;
}

export interface MultiplayerGameState {
  teams: TeamState[];
  currentTeam: TeamId;
  timeRemaining: number;
  isTimerRunning: boolean;
  turnNumber: number;
}
