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
      className={`rounded-xl border p-5 transition-all ${
        isActive
          ? "bg-[#c41e3a]/5 border-[#c41e3a]/40 shadow-md"
          : "bg-white border-[#e8e2d9]"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold ${
              isActive
                ? "bg-[#c41e3a] text-white"
                : "bg-[#e8e2d9] text-[#5a5349]"
            }`}
          >
            {team.id}
          </div>
          <h2
            className="font-bold text-[#1a1a1a]"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            {team.name}
          </h2>
        </div>
        {isActive && (
          <span className="px-3 py-1 rounded-full bg-[#c41e3a] text-white text-xs font-semibold">
            Đang chơi
          </span>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-[#5a5349] text-sm">Điểm</span>
          <span className="text-2xl font-bold text-[#2d5a27]">
            {team.score}
          </span>
        </div>
        <div className="h-px bg-[#e8e2d9]" />
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-[#5a5349]">Đã trả lời</span>
            <p className="font-semibold text-[#1a1a1a]">
              {answeredCount}/{totalQuestions}
            </p>
          </div>
          <div>
            <span className="text-[#5a5349]">Đã tìm</span>
            <p className="font-semibold text-[#1a1a1a]">
              {foundCount}/{totalQuestions}
            </p>
          </div>
        </div>
      </div>

      {team.isCompleted && (
        <div className="mt-4 py-2 rounded-lg bg-[#2d5a27]/10 text-[#2d5a27] text-center text-sm font-semibold">
          Hoàn thành
        </div>
      )}
    </div>
  );
}
