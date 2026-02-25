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
      <div className="text-center py-12">
        <div className="text-2xl font-bold text-gray-600">
          Đã trả lời hết câu hỏi!
        </div>
      </div>
    );
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && isActive) {
      onSubmit();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="mb-4 text-center">
        <h3 className="text-xl font-semibold text-gray-700">
          {teamName} - Câu hỏi {currentQuestionIndex + 1}/{questions.length}
        </h3>
      </div>

      <div
        className={`p-8 rounded-2xl border-4 transition-all ${
          isActive
            ? "bg-white border-blue-500 shadow-2xl"
            : "bg-gray-100 border-gray-300 opacity-60"
        }`}
      >
        {currentQuestion.isAnswered ? (
          <div className="text-center space-y-4">
            {currentQuestion.isFound ? (
              <>
                {/* Đã hoàn thành - Tìm thấy từ */}
                <div className="text-6xl">🎉</div>
                <div className="text-2xl font-bold text-green-600">
                  ✓ Hoàn thành!
                </div>
                <div className="text-xl text-gray-700">
                  Đáp án:{" "}
                  <span className="font-bold">{currentQuestion.answer}</span>
                </div>
                <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg font-medium">
                  Đã trả lời đúng và tìm thấy từ trên lưới
                </div>
              </>
            ) : (
              <>
                {/* Đã trả lời đúng, chưa tìm từ */}
                <div className="text-6xl">📍</div>
                <div className="text-2xl font-bold text-blue-600">
                  ✓ Đã mở khóa!
                </div>
                <div className="text-xl text-gray-700 mb-2">
                  Đáp án:{" "}
                  <span className="font-bold text-blue-600">
                    {currentQuestion.answer}
                  </span>
                </div>
                <div className="bg-blue-100 text-blue-700 px-6 py-3 rounded-lg font-bold text-lg animate-pulse">
                  👉 Hãy tìm từ này trên lưới bên phải!
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-2xl font-semibold text-gray-800 text-center leading-relaxed">
              {currentQuestion.question}
            </div>

            <div className="flex gap-3">
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => onAnswerChange(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nhập câu trả lời..."
                className="flex-1 px-6 py-4 border-3 border-gray-300 rounded-xl text-xl text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                disabled={!isActive}
                autoFocus={isActive}
              />
              <button
                onClick={onSubmit}
                disabled={!isActive || !userAnswer.trim()}
                className="px-8 py-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-bold text-xl disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Trả lời
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Danh sách câu hỏi */}
      <div className="mt-6">
        <div className="flex justify-center gap-6 mb-3 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-gray-600">Hoàn thành</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-gray-600">Đã mở khóa</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-300 rounded border border-yellow-500"></div>
            <span className="text-gray-600">Đang chơi</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded"></div>
            <span className="text-gray-600">Chưa trả lời</span>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {questions.map((q, index) => (
            <div
              key={q.id}
              className={`p-3 rounded-lg text-center font-semibold border-2 transition-all ${
                q.isFound
                  ? "bg-green-500 text-white border-green-600"
                  : q.isAnswered
                    ? "bg-blue-500 text-white border-blue-600"
                    : index === currentQuestionIndex && isActive
                      ? "bg-yellow-300 text-gray-800 border-yellow-500 ring-4 ring-yellow-200"
                      : "bg-gray-200 text-gray-600 border-gray-300"
              }`}
            >
              <div>Câu {index + 1}</div>
              {q.isFound && <div className="text-xs">✓ Hoàn thành</div>}
              {q.isAnswered && !q.isFound && (
                <div className="text-xs">📍 Chưa tìm</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
