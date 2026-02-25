"use client";

import { Question } from "@/types/game";
import { useState } from "react";

interface QuestionPanelProps {
  questions: Question[];
  onAnswerSubmit: (questionId: number, answer: string) => void;
}

export default function QuestionPanel({
  questions,
  onAnswerSubmit,
}: QuestionPanelProps) {
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});

  const handleSubmit = (questionId: number) => {
    const answer = answers[questionId]?.trim().toUpperCase();
    if (answer) {
      onAnswerSubmit(questionId, answer);
    }
  };

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>,
    questionId: number
  ) => {
    if (e.key === "Enter") {
      handleSubmit(questionId);
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-[#e8e2d9] bg-white shadow-sm overflow-hidden">
      <div className="p-5 border-b border-[#e8e2d9] bg-[#f5f1eb]/50">
        <h2
          className="text-lg font-bold text-[#1a1a1a]"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
        >
          Câu hỏi Trivia
        </h2>
      </div>
      <div className="p-5 space-y-4">
        {questions.map((question) => (
          <div
            key={question.id}
            className={`p-4 rounded-xl border transition-all ${
              question.isFound
                ? "bg-[#2d5a27]/5 border-[#2d5a27]/30"
                : question.isAnswered
                ? "bg-[#c41e3a]/5 border-[#c41e3a]/20"
                : "bg-[#faf8f5] border-[#e8e2d9]"
            }`}
          >
            <div className="flex items-start gap-2">
              <span className="font-semibold text-[#5a5349] mt-0.5 shrink-0">
                {question.id}.
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[#1a1a1a] mb-2">{question.question}</p>

                {!question.isAnswered ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={answers[question.id] || ""}
                      onChange={(e) =>
                        setAnswers({
                          ...answers,
                          [question.id]: e.target.value,
                        })
                      }
                      onKeyPress={(e) => handleKeyPress(e, question.id)}
                      placeholder="Nhập câu trả lời..."
                      className="flex-1 px-3 py-2 border border-[#e8e2d9] rounded-lg text-[#1a1a1a] placeholder:text-[#8a8278] focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/50 focus:border-[#2d5a27]"
                      disabled={question.isAnswered}
                    />
                    <button
                      onClick={() => handleSubmit(question.id)}
                      className="px-4 py-2 bg-[#2d5a27] text-white rounded-lg hover:bg-[#23471f] transition-colors font-medium shrink-0"
                    >
                      Trả lời
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-[#2d5a27]">
                      ✓ {question.answer}
                    </span>
                    {question.isFound ? (
                      <span className="text-xs bg-[#2d5a27] text-white px-2 py-1 rounded-lg">
                        Đã tìm!
                      </span>
                    ) : (
                      <span className="text-xs bg-[#c41e3a]/20 text-[#c41e3a] px-2 py-1 rounded-lg font-medium">
                        Tìm trên lưới
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 bg-[#f5f1eb] border-t border-[#e8e2d9] rounded-b-2xl">
        <div className="flex justify-between text-sm">
          <span className="text-[#5a5349]">Đã trả lời:</span>
          <span className="font-semibold text-[#2d5a27]">
            {questions.filter((q) => q.isAnswered).length} / {questions.length}
          </span>
        </div>
        <div className="flex justify-between text-sm mt-1">
          <span className="text-[#5a5349]">Đã tìm thấy:</span>
          <span className="font-semibold text-[#2d5a27]">
            {questions.filter((q) => q.isFound).length} / {questions.length}
          </span>
        </div>
      </div>
    </div>
  );
}
