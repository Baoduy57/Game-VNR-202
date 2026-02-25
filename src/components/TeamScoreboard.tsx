"use client";

import { TeamState } from "@/types/game";

interface TeamScoreboardProps {
  team: TeamState;
  isActive: boolean;
}

export default function TeamScoreboard({
  team,
  isActive,
}: TeamScoreboardProps) {
  const answeredCount = team.questions.filter((q) => q.isAnswered).length;
  const foundCount = team.questions.filter((q) => q.isFound).length;
  const totalQuestions = team.questions.length;

  return (
    <div
      className={`p-6 rounded-xl transition-all ${
        isActive
          ? "bg-blue-500 text-white shadow-2xl scale-105 border-4 border-yellow-400"
          : "bg-white text-gray-800 shadow-lg border-2 border-gray-200"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold ${
              isActive
                ? "bg-yellow-400 text-blue-600"
                : "bg-blue-500 text-white"
            }`}
          >
            {team.id}
          </div>
          <h2 className="text-2xl font-bold">{team.name}</h2>
        </div>
        {isActive && (
          <span className="bg-yellow-400 text-blue-600 px-4 py-2 rounded-full font-bold text-sm">
            Đang chơi
          </span>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="font-medium">Điểm số:</span>
          <span className="text-3xl font-bold">{team.score}</span>
        </div>

        <div className={`h-px ${isActive ? "bg-blue-300" : "bg-gray-300"}`} />

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div
              className={`font-medium mb-1 ${
                isActive ? "text-blue-100" : "text-gray-600"
              }`}
            >
              Đã trả lời
            </div>
            <div className="text-2xl font-bold">
              {answeredCount}/{totalQuestions}
            </div>
          </div>
          <div>
            <div
              className={`font-medium mb-1 ${
                isActive ? "text-blue-100" : "text-gray-600"
              }`}
            >
              Đã tìm thấy
            </div>
            <div className="text-2xl font-bold">
              {foundCount}/{totalQuestions}
            </div>
          </div>
        </div>
      </div>

      {team.isCompleted && (
        <div className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg text-center font-bold">
          🏆 Hoàn thành!
        </div>
      )}
    </div>
  );
}
