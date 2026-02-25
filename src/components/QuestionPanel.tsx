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
    questionId: number,
  ) => {
    if (e.key === "Enter") {
      handleSubmit(questionId);
    }
  };

  return (
    <div className="w-full max-w-md space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Câu hỏi Trivia</h2>

      <div className="space-y-3">
        {questions.map((question) => (
          <div
            key={question.id}
            className={`p-4 rounded-lg border-2 transition-all ${
              question.isFound
                ? "bg-green-100 border-green-400"
                : question.isAnswered
                  ? "bg-blue-100 border-blue-400"
                  : "bg-white border-gray-300"
            }`}
          >
            <div className="flex items-start gap-2">
              <span className="font-semibold text-gray-600 mt-1">
                {question.id}.
              </span>
              <div className="flex-1">
                <p className="text-gray-800 mb-2">{question.question}</p>

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
                      className="flex-1 px-3 py-2 border border-gray-300 rounded text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                      disabled={question.isAnswered}
                    />
                    <button
                      onClick={() => handleSubmit(question.id)}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors font-medium"
                    >
                      Trả lời
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-green-700">
                      ✓ {question.answer}
                    </span>
                    {question.isFound ? (
                      <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">
                        Đã tìm thấy!
                      </span>
                    ) : (
                      <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">
                        Hãy tìm trên lưới!
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Đã trả lời:</span>
          <span className="font-semibold text-blue-600">
            {questions.filter((q) => q.isAnswered).length} / {questions.length}
          </span>
        </div>
        <div className="flex justify-between text-sm mt-2">
          <span className="text-gray-600">Đã tìm thấy:</span>
          <span className="font-semibold text-green-600">
            {questions.filter((q) => q.isFound).length} / {questions.length}
          </span>
        </div>
      </div>
    </div>
  );
}
