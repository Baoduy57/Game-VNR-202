"use client";

import { Question } from "@/types/game";

interface TeamQuestionPanelProps {
  questions: Question[];
  teamName: string;
  currentQuestionIndex: number;
  userAnswer: string;
  onAnswerChange: (answer: string) => void;
  onSubmit: () => void;
  isActive: boolean;
}

export default function TeamQuestionPanel({
  questions,
  teamName,
  currentQuestionIndex,
  userAnswer,
  onAnswerChange,
  onSubmit,
  isActive,
}: TeamQuestionPanelProps) {
  const currentQuestion = questions[currentQuestionIndex];

  if (!currentQuestion) {
    return (
      <div className="w-full max-w-md rounded-2xl border border-[#e8e2d9] bg-white p-8 text-center">
        <p className="text-xl font-semibold text-[#5a5349]">
          Đã trả lời hết câu hỏi!
        </p>
      </div>
    );
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && isActive) {
      onSubmit();
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-[#e8e2d9] bg-white shadow-sm overflow-hidden">
      <div className="p-5 border-b border-[#e8e2d9] bg-[#f5f1eb]/50">
        <p className="text-sm text-[#5a5349]">
          {teamName} — Câu {currentQuestionIndex + 1}/{questions.length}
        </p>
      </div>

      <div className="p-6">
        {currentQuestion.isAnswered ? (
          <div className="text-center space-y-4">
            {currentQuestion.isFound ? (
              <>
                <div className="text-5xl">🎉</div>
                <p className="font-bold text-[#2d5a27]">Hoàn thành!</p>
                <p className="text-[#5a5349]">
                  Đáp án:{" "}
                  <span className="font-semibold text-[#1a1a1a]">
                    {currentQuestion.answer}
                  </span>
                </p>
                <div className="inline-block px-4 py-2 rounded-lg bg-[#2d5a27]/10 text-[#2d5a27] text-sm font-medium">
                  Đã trả lời đúng và tìm thấy từ
                </div>
              </>
            ) : (
              <>
                <div className="text-5xl">📍</div>
                <p className="font-bold text-[#c41e3a]">Đã mở khóa!</p>
                <p className="text-[#5a5349]">
                  Đáp án:{" "}
                  <span className="font-semibold text-[#c41e3a]">
                    {currentQuestion.answer}
                  </span>
                </p>
                <div className="inline-block px-4 py-3 rounded-lg bg-[#c41e3a]/10 text-[#c41e3a] font-semibold animate-pulse">
                  Tìm từ này trên lưới →
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-5">
            <p className="text-lg font-medium text-[#1a1a1a] leading-relaxed">
              {currentQuestion.question}
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => onAnswerChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Nhập câu trả lời..."
                className="flex-1 px-4 py-3 rounded-xl border border-[#e8e2d9] text-[#1a1a1a] placeholder:text-[#8a8278] focus:outline-none focus:ring-2 focus:ring-[#c41e3a]/50 focus:border-[#c41e3a] disabled:bg-[#f5f1eb]"
                disabled={!isActive}
                autoFocus={isActive}
              />
              <button
                onClick={onSubmit}
                disabled={!isActive || !userAnswer.trim()}
                className="px-5 py-3 rounded-xl bg-[#c41e3a] text-white font-semibold hover:bg-[#a01830] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              >
                Trả lời
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Question progress */}
      <div className="p-4 bg-[#f5f1eb] border-t border-[#e8e2d9]">
        <div className="flex flex-wrap gap-2">
          {questions.map((q, index) => (
            <div
              key={q.id}
              className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-semibold transition-all ${
                q.isFound
                  ? "bg-[#2d5a27] text-white"
                  : q.isAnswered
                  ? "bg-[#c41e3a]/20 text-[#c41e3a]"
                  : index === currentQuestionIndex && isActive
                  ? "bg-[#d4a853]/30 text-[#1a1a1a] ring-2 ring-[#d4a853]"
                  : "bg-[#e8e2d9] text-[#5a5349]"
              }`}
            >
              {index + 1}
            </div>
          ))}
        </div>
        <div className="flex gap-4 mt-3 text-xs text-[#5a5349]">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-[#2d5a27]" /> Hoàn thành
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-[#c41e3a]/50" /> Chưa tìm
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-[#d4a853]/50" /> Đang chơi
          </span>
        </div>
      </div>
    </div>
  );
}
