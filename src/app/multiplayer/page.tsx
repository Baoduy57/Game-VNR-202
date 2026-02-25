"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import TeamScoreboard from "@/components/TeamScoreboard";
import TeamQuestionPanel from "@/components/TeamQuestionPanel";
import WordGrid from "@/components/WordGrid";
import Timer from "@/components/Timer";
import { TeamState, TeamId, GridCell } from "@/types/game";
import { generateGrid, checkWord } from "@/utils/gridGenerator";
import { createTeam1Questions, createTeam2Questions } from "@/data/questions";

const TURN_TIME = 120; // Giây mỗi lượt

type GamePhase = "setup" | "playing" | "finished";

const bgPattern = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231a1a1a' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
};

export default function MultiplayerGame() {
  const [gamePhase, setGamePhase] = useState<GamePhase>("setup");
  const [teams, setTeams] = useState<TeamState[]>([]);
  const [currentTeam, setCurrentTeam] = useState<TeamId>(1);
  const [timeRemaining, setTimeRemaining] = useState(TURN_TIME);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [turnNumber, setTurnNumber] = useState(1);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const [team1Name, setTeam1Name] = useState("Đội 1");
  const [team2Name, setTeam2Name] = useState("Đội 2");

  // Hàm tạo lưới với retry khi có từ không đặt được
  const generateGridWithRetry = useCallback(
    (
      questions: {
        id: number;
        question: string;
        answer: string;
        isAnswered: boolean;
        isFound: boolean;
      }[]
    ) => {
      const MAX_RETRIES = 10;
      let result = generateGrid(questions);
      for (let i = 0; i < MAX_RETRIES && result.failedWords.length > 0; i++) {
        result = generateGrid(questions);
      }
      if (result.failedWords.length > 0) {
        console.error("Không thể đặt từ vào lưới:", result.failedWords);
      }
      return result;
    },
    []
  );

  // Khởi tạo game
  const initGame = useCallback(() => {
    const team1Questions = createTeam1Questions();
    const team2Questions = createTeam2Questions();

    const team1Grid = generateGridWithRetry(team1Questions);
    const team2Grid = generateGridWithRetry(team2Questions);

    const newTeams: TeamState[] = [
      {
        id: 1,
        name: team1Name,
        questions: team1Questions,
        grid: team1Grid.grid,
        wordPositions: team1Grid.wordPositions,
        score: 0,
        isCompleted: false,
      },
      {
        id: 2,
        name: team2Name,
        questions: team2Questions,
        grid: team2Grid.grid,
        wordPositions: team2Grid.wordPositions,
        score: 0,
        isCompleted: false,
      },
    ];

    setTeams(newTeams);
    setCurrentTeam(1);
    setTimeRemaining(TURN_TIME);
    setIsTimerRunning(true);
    setTurnNumber(1);
    setCurrentQuestionIndex(0);
    setUserAnswer("");
    setMessage(null);
    setGamePhase("playing");
  }, [team1Name, team2Name, generateGridWithRetry]);

  // Chuyển lượt
  const switchTurn = useCallback(() => {
    const nextTeam: TeamId = currentTeam === 1 ? 2 : 1;
    setCurrentTeam(nextTeam);
    setTimeRemaining(TURN_TIME);
    setIsTimerRunning(true);
    setUserAnswer("");
    setTurnNumber((prev) => prev + 1);

    // Tìm câu hỏi chưa trả lời tiếp theo
    const team = teams.find((t) => t.id === nextTeam);
    if (team) {
      const nextQuestionIndex = team.questions.findIndex((q) => !q.isAnswered);
      setCurrentQuestionIndex(
        nextQuestionIndex !== -1 ? nextQuestionIndex : team.questions.length - 1
      );
    }

    showMessage(`Đến lượt ${nextTeam === 1 ? team1Name : team2Name}!`, "info");
  }, [currentTeam, teams, team1Name, team2Name]);

  // Xử lý hết thời gian
  const handleTimeUp = useCallback(() => {
    setIsTimerRunning(false);
    showMessage("⏰ Hết giờ! Chuyển lượt!", "error");
    setTimeout(() => {
      switchTurn();
    }, 2000);
  }, [switchTurn]);

  // Xử lý trả lời câu hỏi
  const handleAnswerSubmit = () => {
    if (!userAnswer.trim()) return;

    const team = teams.find((t) => t.id === currentTeam);
    if (!team) return;

    const question = team.questions[currentQuestionIndex];
    if (!question || question.isAnswered) return;

    const correctAnswer = question.answer.toUpperCase().replace(/\s/g, "");
    const userAnswerClean = userAnswer.toUpperCase().replace(/\s/g, "");

    if (userAnswerClean === correctAnswer) {
      // Đáp án đúng
      const updatedTeams = teams.map((t) => {
        if (t.id === currentTeam) {
          const updatedQuestions = t.questions.map((q) =>
            q.id === question.id ? { ...q, isAnswered: true } : q
          );
          return {
            ...t,
            questions: updatedQuestions,
            score: t.score + 10,
          };
        }
        return t;
      });

      setTeams(updatedTeams);
      setUserAnswer("");
      showMessage(
        `✓ Chính xác! Hãy tìm từ "${correctAnswer}" trên lưới!`,
        "success"
      );
    } else {
      showMessage("✗ Sai rồi! Hãy thử lại.", "error");
    }
  };

  // Xử lý tìm từ trên lưới
  const handleWordFound = (cells: GridCell[]) => {
    const team = teams.find((t) => t.id === currentTeam);
    if (!team) return;

    const unlockedWords = team.questions
      .filter((q) => q.isAnswered && !q.isFound)
      .map((q) => q.answer.toUpperCase().replace(/\s/g, ""));

    if (unlockedWords.length === 0) {
      showMessage("Bạn cần trả lời câu hỏi trước!", "info");
      return;
    }

    const foundWord = checkWord(cells, unlockedWords);

    if (foundWord) {
      const updatedTeams = teams.map((t) => {
        if (t.id === currentTeam) {
          const updatedQuestions = t.questions.map((q) =>
            q.answer.toUpperCase().replace(/\s/g, "") === foundWord
              ? { ...q, isFound: true }
              : q
          );

          const updatedGrid = t.grid.map((row) =>
            row.map((cell) => {
              const isInFoundWord = cells.some(
                (c) => c.row === cell.row && c.col === cell.col
              );
              return isInFoundWord ? { ...cell, isFound: true } : cell;
            })
          );

          const newScore = t.score + 20;
          const allFound = updatedQuestions.every((q) => q.isFound);

          return {
            ...t,
            questions: updatedQuestions,
            grid: updatedGrid,
            score: newScore,
            isCompleted: allFound,
          };
        }
        return t;
      });

      setTeams(updatedTeams);
      showMessage(
        `🎉 Tuyệt vời! Tìm thấy từ "${foundWord}"! +20 điểm!`,
        "success"
      );

      // Chuyển sang câu hỏi tiếp theo
      const currentTeamState = updatedTeams.find((t) => t.id === currentTeam);
      if (currentTeamState) {
        const nextQuestionIndex = currentTeamState.questions.findIndex(
          (q) => !q.isAnswered
        );

        if (nextQuestionIndex !== -1) {
          setCurrentQuestionIndex(nextQuestionIndex);
          setUserAnswer("");
          // Reset timer cho câu mới
          setTimeRemaining(TURN_TIME);
        } else {
          // Hết câu hỏi - kết thúc lượt
          setIsTimerRunning(false);
          if (currentTeamState.isCompleted) {
            checkGameEnd(updatedTeams);
          } else {
            setTimeout(() => switchTurn(), 2000);
          }
        }
      }
    } else {
      showMessage("Không tìm thấy từ nào!", "error");
    }
  };

  // Kiểm tra kết thúc game
  const checkGameEnd = (currentTeams: TeamState[]) => {
    const bothCompleted = currentTeams.every((t) => t.isCompleted);
    if (bothCompleted) {
      setGamePhase("finished");
      setIsTimerRunning(false);
    }
  };

  const showMessage = (text: string, type: "success" | "error" | "info") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleTimerTick = () => {
    setTimeRemaining((prev) => Math.max(0, prev - 1));
  };

  // Setup screen
  if (gamePhase === "setup") {
    return (
      <div className="min-h-screen bg-[#faf8f5] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={bgPattern} />
        <div className="relative flex items-center justify-center p-6 sm:p-8 min-h-screen">
          <div className="w-full max-w-md">
            <div className="rounded-2xl border border-[#e8e2d9] bg-white shadow-sm overflow-hidden">
              <div className="p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-[#c41e3a]/10 flex items-center justify-center text-4xl mx-auto mb-6">
                  👥
                </div>
                <h1
                  className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] mb-2"
                  style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                >
                  Thi đấu 2 đội
                </h1>
                <p className="text-[#5a5349]">Trình chiếu — Chọn tên đội</p>
              </div>
              <div className="px-6 pb-8 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-[#5a5349] mb-2">
                    Tên Đội 1
                  </label>
                  <input
                    type="text"
                    value={team1Name}
                    onChange={(e) => setTeam1Name(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#e8e2d9] text-[#1a1a1a] placeholder:text-[#8a8278] focus:outline-none focus:ring-2 focus:ring-[#c41e3a]/50 focus:border-[#c41e3a]"
                    placeholder="Nhập tên đội 1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#5a5349] mb-2">
                    Tên Đội 2
                  </label>
                  <input
                    type="text"
                    value={team2Name}
                    onChange={(e) => setTeam2Name(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#e8e2d9] text-[#1a1a1a] placeholder:text-[#8a8278] focus:outline-none focus:ring-2 focus:ring-[#c41e3a]/50 focus:border-[#c41e3a]"
                    placeholder="Nhập tên đội 2"
                  />
                </div>
                <button
                  onClick={initGame}
                  className="w-full py-4 rounded-xl bg-[#c41e3a] text-white font-semibold hover:bg-[#a01830] transition-colors flex items-center justify-center gap-2"
                >
                  Bắt đầu thi đấu
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </button>
              </div>
              <div className="px-6 pb-8">
                <div className="p-4 rounded-xl bg-[#f5f1eb] border border-[#e8e2d9]">
                  <h3 className="font-bold text-[#1a1a1a] mb-2 flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-[#e8e2d9] flex items-center justify-center text-xs">
                      📋
                    </span>
                    Luật chơi
                  </h3>
                  <ul className="text-[#5a5349] text-sm space-y-1">
                    <li>• 120 giây mỗi lượt</li>
                    <li>• Trả lời đúng: +10 điểm</li>
                    <li>• Tìm đúng từ: +20 điểm</li>
                    <li>• 2 đội chơi luân phiên</li>
                  </ul>
                </div>
              </div>
            </div>
            <Link
              href="/"
              className="mt-4 block text-center text-[#5a5349] text-sm hover:text-[#1a1a1a] transition-colors"
            >
              ← Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Finished screen
  if (gamePhase === "finished") {
    const winner =
      teams[0].score > teams[1].score
        ? teams[0]
        : teams[0].score < teams[1].score
        ? teams[1]
        : null;

    return (
      <div className="min-h-screen bg-[#faf8f5] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={bgPattern} />
        <div className="relative flex items-center justify-center p-6 sm:p-8 min-h-screen">
          <div className="w-full max-w-2xl">
            <div className="rounded-2xl border border-[#e8e2d9] bg-white shadow-sm p-8 sm:p-10 text-center">
              <div className="text-6xl mb-5">🏆</div>
              <h1
                className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] mb-8"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
              >
                Trò chơi kết thúc!
              </h1>

              {winner ? (
                <div className="mb-8 p-6 sm:p-8 rounded-2xl bg-[#d4a853]/15 border-2 border-[#d4a853]/50 shadow-lg">
                  <p className="text-4xl sm:text-5xl mb-4">🎉</p>
                  <p className="text-[#c41e3a] font-bold text-lg mb-2 uppercase tracking-wide">
                    Chúc mừng
                  </p>
                  <p className="text-2xl sm:text-4xl font-bold text-[#1a1a1a] mb-2">
                    {winner.name}
                  </p>
                  <p className="text-[#5a5349] text-sm mb-3">
                    Đội có điểm số cao nhất
                  </p>
                  <p className="text-4xl sm:text-5xl font-bold text-[#d4a853]">
                    {winner.score} điểm
                  </p>
                  <p className="text-[#2d5a27] font-semibold mt-2 text-sm">
                    🏆 Xuất sắc!
                  </p>
                </div>
              ) : (
                <div className="mb-8">
                  <p className="text-[#5a5349] font-semibold mb-2">Hòa</p>
                  <p className="text-3xl font-bold text-[#1a1a1a]">
                    {teams[0].score} — {teams[1].score}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mb-8">
                {teams.map((team) => (
                  <div
                    key={team.id}
                    className={`p-5 rounded-xl border ${
                      winner?.id === team.id
                        ? "bg-[#c41e3a]/5 border-[#c41e3a]/30"
                        : "bg-[#f5f1eb] border-[#e8e2d9]"
                    }`}
                  >
                    <p className="font-bold text-[#1a1a1a] mb-1">{team.name}</p>
                    <p className="text-2xl font-bold text-[#2d5a27]">
                      {team.score} điểm
                    </p>
                    <p className="text-xs text-[#5a5349] mt-1">
                      {team.questions.filter((q) => q.isFound).length}/
                      {team.questions.length} từ
                    </p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setGamePhase("setup")}
                className="px-8 py-3 rounded-xl bg-[#c41e3a] text-white font-semibold hover:bg-[#a01830] transition-colors"
              >
                Chơi lại
              </button>
              <Link
                href="/"
                className="ml-3 inline-block px-8 py-3 rounded-xl border border-[#e8e2d9] text-[#5a5349] font-medium hover:bg-[#f5f1eb] transition-colors"
              >
                Về trang chủ
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Playing screen
  const activeTeam = teams.find((t) => t.id === currentTeam);
  if (!activeTeam) return null;

  return (
    <div className="min-h-screen bg-[#faf8f5] relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={bgPattern}
      />
      <div className="relative py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <header className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#c41e3a]/10 flex items-center justify-center text-xl">
                  👥
                </div>
                <div>
                  <h1
                    className="text-xl sm:text-2xl font-bold text-[#1a1a1a]"
                    style={{
                      fontFamily: "var(--font-playfair), Georgia, serif",
                    }}
                  >
                    Thi đấu — Lượt {turnNumber}
                  </h1>
                  <p className="text-sm text-[#5a5349]">120 giây mỗi lượt</p>
                </div>
              </div>
              <Link
                href="/"
                className="px-4 py-2 rounded-lg border border-[#e8e2d9] text-[#5a5349] text-sm font-medium hover:bg-white hover:shadow-sm transition-all shrink-0"
              >
                ← Trang chủ
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {teams.map((team) => (
                <TeamScoreboard
                  key={team.id}
                  team={team}
                  isActive={team.id === currentTeam}
                />
              ))}
            </div>

            <div className="max-w-2xl mx-auto">
              <Timer
                timeRemaining={timeRemaining}
                totalTime={TURN_TIME}
                isRunning={isTimerRunning}
                onTimeUp={handleTimeUp}
                onTick={handleTimerTick}
              />
            </div>
          </header>

          {/* Message toast */}
          {message && (
            <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-[fadeIn_0.25s_ease-out]">
              <div
                className={`px-6 py-4 rounded-xl text-center font-medium shadow-lg border ${
                  message.type === "success"
                    ? "bg-[#2d5a27]/95 text-white border-[#2d5a27]"
                    : message.type === "error"
                    ? "bg-[#c41e3a]/95 text-white border-[#c41e3a]"
                    : "bg-white text-[#1a1a1a] border-[#e8e2d9]"
                }`}
              >
                {message.text}
              </div>
            </div>
          )}

          {/* Game Area */}
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-start">
            <div className="flex justify-center">
              <TeamQuestionPanel
                questions={activeTeam.questions}
                teamName={activeTeam.name}
                currentQuestionIndex={currentQuestionIndex}
                userAnswer={userAnswer}
                onAnswerChange={setUserAnswer}
                onSubmit={handleAnswerSubmit}
                isActive={true}
              />
            </div>
            <div className="flex justify-center">
              <WordGrid grid={activeTeam.grid} onWordFound={handleWordFound} />
            </div>
          </div>

          {/* Controls */}
          <div className="mt-8 flex justify-center gap-3">
            <button
              onClick={switchTurn}
              className="px-6 py-3 rounded-xl bg-[#d4a853] text-[#1a1a1a] font-semibold hover:bg-[#c49a45] transition-colors"
            >
              Chuyển lượt
            </button>
            <Link
              href="/"
              className="px-6 py-3 rounded-xl border border-[#e8e2d9] text-[#5a5349] font-medium hover:bg-[#f5f1eb] transition-colors"
            >
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
