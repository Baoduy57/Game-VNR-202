"use client";

import { useState, useEffect, useCallback } from "react";
import TeamScoreboard from "@/components/TeamScoreboard";
import TeamQuestionPanel from "@/components/TeamQuestionPanel";
import WordGrid from "@/components/WordGrid";
import Timer from "@/components/Timer";
import { TeamState, TeamId, GridCell } from "@/types/game";
import { generateGrid, checkWord } from "@/utils/gridGenerator";
import { createTeam1Questions, createTeam2Questions } from "@/data/questions";

const TURN_TIME = 180; // 60 giây mỗi lượt

type GamePhase = "setup" | "playing" | "finished";

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

  // Khởi tạo game
  const initGame = useCallback(() => {
    // Tạo 2 bộ câu hỏi khác nhau cho 2 đội
    const team1Questions = createTeam1Questions();
    const team2Questions = createTeam2Questions();

    // Tạo 2 lưới khác nhau cho 2 đội
    const team1Grid = generateGrid(team1Questions);
    const team2Grid = generateGrid(team2Questions);

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
  }, [team1Name, team2Name]);

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
        nextQuestionIndex !== -1
          ? nextQuestionIndex
          : team.questions.length - 1,
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
            q.id === question.id ? { ...q, isAnswered: true } : q,
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
        "success",
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
              : q,
          );

          const updatedGrid = t.grid.map((row) =>
            row.map((cell) => {
              const isInFoundWord = cells.some(
                (c) => c.row === cell.row && c.col === cell.col,
              );
              return isInFoundWord ? { ...cell, isFound: true } : cell;
            }),
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
        "success",
      );

      // Chuyển sang câu hỏi tiếp theo
      const currentTeamState = updatedTeams.find((t) => t.id === currentTeam);
      if (currentTeamState) {
        const nextQuestionIndex = currentTeamState.questions.findIndex(
          (q) => !q.isAnswered,
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
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-8">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-2xl w-full">
          <h1 className="text-5xl font-bold text-center mb-8 text-gray-800">
            🎮 Trivia Word Search
          </h1>
          <p className="text-xl text-center text-gray-600 mb-8">
            Chế độ 2 đội - Trình chiếu
          </p>

          <div className="space-y-6">
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                Tên Đội 1:
              </label>
              <input
                type="text"
                value={team1Name}
                onChange={(e) => setTeam1Name(e.target.value)}
                className="w-full px-6 py-4 text-xl border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500"
                placeholder="Nhập tên đội 1"
              />
            </div>

            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                Tên Đội 2:
              </label>
              <input
                type="text"
                value={team2Name}
                onChange={(e) => setTeam2Name(e.target.value)}
                className="w-full px-6 py-4 text-xl border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500"
                placeholder="Nhập tên đội 2"
              />
            </div>

            <button
              onClick={initGame}
              className="w-full py-6 bg-blue-500 text-white text-2xl font-bold rounded-xl hover:bg-blue-600 transition-colors shadow-lg"
            >
              🚀 Bắt đầu trò chơi
            </button>
          </div>

          <div className="mt-8 p-6 bg-blue-50 rounded-xl">
            <h3 className="font-bold text-lg mb-3 text-gray-800">
              📋 Luật chơi:
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Mỗi đội có 60 giây mỗi lượt</li>
              <li>• Trả lời đúng câu hỏi: +10 điểm</li>
              <li>• Tìm đúng từ trên lưới: +20 điểm</li>
              <li>• 2 đội chơi luân phiên cho đến khi hoàn thành</li>
            </ul>
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
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-8">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-4xl w-full text-center">
          <div className="text-8xl mb-6">🏆</div>
          <h1 className="text-5xl font-bold mb-8 text-gray-800">
            Trò chơi kết thúc!
          </h1>

          {winner ? (
            <div className="mb-8">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                🎉 Chiến thắng: {winner.name}
              </div>
              <div className="text-6xl font-bold text-yellow-500">
                {winner.score} điểm
              </div>
            </div>
          ) : (
            <div className="mb-8">
              <div className="text-3xl font-bold text-gray-600">🤝 Hòa!</div>
              <div className="text-5xl font-bold text-blue-600">
                {teams[0].score} - {teams[1].score}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-6 mb-8">
            {teams.map((team) => (
              <div
                key={team.id}
                className="p-6 bg-gray-50 rounded-xl border-2 border-gray-200"
              >
                <div className="text-2xl font-bold mb-2">{team.name}</div>
                <div className="text-4xl font-bold text-blue-600 mb-3">
                  {team.score} điểm
                </div>
                <div className="text-sm text-gray-600">
                  {team.questions.filter((q) => q.isFound).length}/
                  {team.questions.length} từ tìm thấy
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setGamePhase("setup")}
            className="px-12 py-6 bg-blue-500 text-white text-2xl font-bold rounded-xl hover:bg-blue-600 transition-colors shadow-lg"
          >
            🔄 Chơi lại
          </button>
        </div>
      </div>
    );
  }

  // Playing screen
  const activeTeam = teams.find((t) => t.id === currentTeam);
  if (!activeTeam) return null;

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 py-6 px-4">
      <div className="max-w-450 mx-auto">
        {/* Header với scoreboards */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">
            🎮 Trivia Word Search - Lượt {turnNumber}
          </h1>

          <div className="grid grid-cols-2 gap-6 mb-6">
            {teams.map((team) => (
              <TeamScoreboard
                key={team.id}
                team={team}
                isActive={team.id === currentTeam}
              />
            ))}
          </div>

          {/* Timer */}
          <div className="max-w-2xl mx-auto mb-6">
            <Timer
              timeRemaining={timeRemaining}
              totalTime={TURN_TIME}
              isRunning={isTimerRunning}
              onTimeUp={handleTimeUp}
              onTick={handleTimerTick}
            />
          </div>
        </div>

        {/* Message - Fixed position */}
        {message && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
            <div
              className={`px-8 py-4 rounded-xl text-center font-bold text-xl shadow-2xl ${
                message.type === "success"
                  ? "bg-green-100 text-green-800 border-4 border-green-400"
                  : message.type === "error"
                    ? "bg-red-100 text-red-800 border-4 border-red-400"
                    : "bg-blue-100 text-blue-800 border-4 border-blue-400"
              }`}
            >
              {message.text}
            </div>
          </div>
        )}

        {/* Game Area */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Question Panel */}
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

          {/* Word Grid */}
          <div className="flex justify-center">
            <WordGrid grid={activeTeam.grid} onWordFound={handleWordFound} />
          </div>
        </div>

        {/* Control buttons */}
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={switchTurn}
            className="px-6 py-3 bg-yellow-500 text-white font-bold rounded-xl hover:bg-yellow-600 transition-colors"
          >
            ⏭️ Chuyển lượt
          </button>
          <button
            onClick={() => setGamePhase("setup")}
            className="px-6 py-3 bg-gray-500 text-white font-bold rounded-xl hover:bg-gray-600 transition-colors"
          >
            🏠 Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
}
