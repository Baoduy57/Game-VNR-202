"use client";

import { useState, useEffect } from "react";
import QuestionPanel from "@/components/QuestionPanel";
import WordGrid from "@/components/WordGrid";
import { Question, GridCell, WordPosition } from "@/types/game";
import { generateGrid, checkWord } from "@/utils/gridGenerator";
import { createDemoQuestions } from "@/data/demoQuestions";
import Link from "next/link";

type DemoStep = "intro" | "playing" | "completed";

export default function DemoPage() {
  const [step, setStep] = useState<DemoStep>("intro");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [grid, setGrid] = useState<GridCell[][]>([]);
  const [wordPositions, setWordPositions] = useState<WordPosition[]>([]);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const [showInstructions, setShowInstructions] = useState(true);

  // Khởi tạo game demo - retry nếu có từ không đặt được (do random)
  const initGame = () => {
    const newQuestions = createDemoQuestions();
    const MAX_RETRIES = 10;
    let result = generateGrid(newQuestions);

    for (let i = 0; i < MAX_RETRIES && result.failedWords.length > 0; i++) {
      result = generateGrid(newQuestions);
    }

    if (result.failedWords.length > 0) {
      console.error("Không thể đặt các từ vào lưới:", result.failedWords);
    }

    setQuestions(newQuestions);
    setGrid(result.grid);
    setWordPositions(result.wordPositions);
    setScore(0);
    setMessage(null);
    setStep("playing");
    setShowInstructions(true);
  };

  // Xử lý khi người chơi trả lời câu hỏi
  const handleAnswerSubmit = (questionId: number, answer: string) => {
    const question = questions.find((q) => q.id === questionId);
    if (!question) return;

    const correctAnswer = question.answer.toUpperCase().replace(/\s/g, "");
    const userAnswer = answer.toUpperCase().replace(/\s/g, "");

    if (userAnswer === correctAnswer) {
      const updatedQuestions = questions.map((q) =>
        q.id === questionId ? { ...q, isAnswered: true } : q
      );
      setQuestions(updatedQuestions);
      setScore(score + 10);
      showMessage(
        `✓ Chính xác! Bây giờ hãy tìm từ "${correctAnswer}" trên lưới bên phải!`,
        "success"
      );
    } else {
      showMessage("✗ Sai rồi! Hãy thử lại nhé.", "error");
    }
  };

  // Xử lý khi người chơi tìm từ trên lưới
  const handleWordFound = (cells: GridCell[]) => {
    const unlockedWords = questions
      .filter((q) => q.isAnswered && !q.isFound)
      .map((q) => q.answer.toUpperCase().replace(/\s/g, ""));

    if (unlockedWords.length === 0) {
      showMessage("Bạn cần trả lời câu hỏi trước khi tìm từ!", "info");
      return;
    }

    const foundWord = checkWord(cells, unlockedWords);

    if (foundWord) {
      const updatedQuestions = questions.map((q) =>
        q.answer.toUpperCase().replace(/\s/g, "") === foundWord
          ? { ...q, isFound: true }
          : q
      );
      setQuestions(updatedQuestions);

      const updatedGrid = grid.map((row) =>
        row.map((cell) => {
          const isInFoundWord = cells.some(
            (c) => c.row === cell.row && c.col === cell.col
          );
          return isInFoundWord ? { ...cell, isFound: true } : cell;
        })
      );
      setGrid(updatedGrid);

      setScore(score + 20);
      showMessage(
        `🎉 Tuyệt vời! Bạn đã tìm thấy từ "${foundWord}"!`,
        "success"
      );

      const allFound = updatedQuestions.every((q) => q.isFound);
      if (allFound) {
        setStep("completed");
      }
    } else {
      showMessage("Không tìm thấy từ nào! Hãy thử lại.", "error");
    }
  };

  const showMessage = (text: string, type: "success" | "error" | "info") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  // Intro screen
  if (step === "intro") {
    return (
      <div className="min-h-screen bg-[#faf8f5] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231a1a1a' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative flex items-center justify-center p-6 sm:p-8 min-h-screen">
          <div className="w-full max-w-2xl">
            <div className="rounded-2xl border border-[#e8e2d9] bg-white shadow-sm overflow-hidden">
              <div className="p-8 sm:p-10 text-center">
                <div className="w-16 h-16 rounded-2xl bg-[#2d5a27]/10 flex items-center justify-center text-4xl mx-auto mb-6">
                  🎓
                </div>
                <h1
                  className="text-3xl sm:text-4xl font-bold text-[#1a1a1a] mb-3"
                  style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                >
                  Chế độ Demo
                </h1>
                <p className="text-lg text-[#5a5349]">
                  Làm quen với cách chơi trước khi thi đấu!
                </p>
              </div>

              <div className="px-6 sm:px-10 pb-8">
                <h2
                  className="text-lg font-bold text-[#1a1a1a] mb-6 flex items-center gap-2"
                  style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                >
                  <span className="w-7 h-7 rounded-lg bg-[#e8e2d9] flex items-center justify-center text-sm">
                    📋
                  </span>
                  Hướng dẫn chi tiết
                </h2>
                <div className="space-y-5">
                  {[
                    {
                      step: 1,
                      title: "Đọc câu hỏi",
                      desc: 'Xem các câu hỏi ở panel bên trái. Nhập câu trả lời và nhấn "Trả lời".',
                      color: "bg-[#2d5a27]/15 text-[#2d5a27]",
                    },
                    {
                      step: 2,
                      title: "Mở khóa từ",
                      desc: "Trả lời đúng → từ được mở khóa trên lưới. Nhận +10 điểm.",
                      color: "bg-[#2d5a27]/15 text-[#2d5a27]",
                    },
                    {
                      step: 3,
                      title: "Tìm từ trên lưới",
                      desc: "Kéo chuột qua các chữ cái (ngang/dọc/chéo). Tìm đúng nhận +20 điểm.",
                      color: "bg-[#c41e3a]/10 text-[#c41e3a]",
                    },
                    {
                      step: 4,
                      title: "Hoàn thành",
                      desc: "Trả lời đúng và tìm hết tất cả từ để hoàn thành game!",
                      color: "bg-[#d4a853]/20 text-[#8a6d3b]",
                    },
                  ].map(({ step, title, desc, color }) => (
                    <div key={step} className="flex gap-4">
                      <span
                        className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center font-bold ${color}`}
                      >
                        {step}
                      </span>
                      <div>
                        <strong className="block text-[#1a1a1a] mb-0.5">
                          {title}
                        </strong>
                        <p className="text-[#5a5349] text-sm">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 rounded-xl bg-[#f5f1eb] border border-[#e8e2d9]">
                  <h3 className="font-bold text-[#1a1a1a] mb-2 flex items-center gap-2">
                    <span>💡</span> Lưu ý
                  </h3>
                  <ul className="text-[#5a5349] text-sm space-y-1">
                    <li>• Demo không giới hạn thời gian — chơi thoải mái</li>
                    <li>• 5 câu hỏi đơn giản để làm quen</li>
                    <li>• Kéo chuột theo đường thẳng (ngang/dọc/chéo)</li>
                    <li>• Phải trả lời đúng trước khi tìm từ</li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-3 mt-8">
                  <Link
                    href="/"
                    className="px-6 py-3 rounded-xl border border-[#e8e2d9] text-[#5a5349] font-medium hover:bg-[#f5f1eb] transition-colors text-center"
                  >
                    ← Về trang chủ
                  </Link>
                  <button
                    onClick={initGame}
                    className="px-8 py-3 rounded-xl bg-[#2d5a27] text-white font-semibold hover:bg-[#23471f] transition-colors shadow-sm flex items-center justify-center gap-2"
                  >
                    Bắt đầu Demo
                    <svg
                      className="w-4 h-4"
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
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Completed screen
  if (step === "completed") {
    return (
      <div className="min-h-screen bg-[#faf8f5] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231a1a1a' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative flex items-center justify-center p-6 sm:p-8 min-h-screen">
          <div className="w-full max-w-md text-center">
            <div className="rounded-2xl border border-[#e8e2d9] bg-white shadow-sm p-8 sm:p-10">
              <div className="text-6xl mb-5">🎉</div>
              <h1
                className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] mb-2"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
              >
                Hoàn thành Demo!
              </h1>
              <p className="text-[#5a5349] mb-6">
                Bạn đã hiểu cách chơi rồi đấy!
              </p>
              <div className="text-4xl font-bold text-[#2d5a27] mb-8">
                {score} điểm
              </div>

              <div className="rounded-xl bg-[#2d5a27]/5 border border-[#2d5a27]/20 p-5 mb-8 text-left">
                <h3 className="font-bold text-[#1a1a1a] mb-3">
                  ✓ Bạn đã nắm được:
                </h3>
                <ul className="space-y-2 text-[#5a5349] text-sm">
                  <li>✓ Trả lời câu hỏi để mở khóa từ</li>
                  <li>✓ Kéo chuột tìm từ trên lưới</li>
                  <li>✓ Hệ thống điểm số và hoàn thành</li>
                </ul>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={initGame}
                  className="px-6 py-3 rounded-xl bg-[#2d5a27] text-white font-semibold hover:bg-[#23471f] transition-colors"
                >
                  Chơi Demo lại
                </button>
                <Link
                  href="/multiplayer"
                  className="px-6 py-3 rounded-xl bg-[#c41e3a] text-white font-semibold hover:bg-[#a01830] transition-colors"
                >
                  Vào thi đấu thật
                </Link>
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
      </div>
    );
  }

  // Loading
  if (grid.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf8f5]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[#e8e2d9] border-t-[#2d5a27] rounded-full animate-spin" />
          <p className="text-[#5a5349] font-medium">Đang tải demo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231a1a1a' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      <div className="relative py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <header className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#2d5a27]/10 flex items-center justify-center text-xl">
                  🎓
                </div>
                <div>
                  <h1
                    className="text-xl sm:text-2xl font-bold text-[#1a1a1a]"
                    style={{
                      fontFamily: "var(--font-playfair), Georgia, serif",
                    }}
                  >
                    Chế độ Demo
                  </h1>
                  <p className="text-sm text-[#5a5349]">
                    Không giới hạn thời gian
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <Link
                  href="/"
                  className="px-4 py-2 rounded-lg border border-[#e8e2d9] text-[#5a5349] text-sm font-medium hover:bg-white hover:shadow-sm transition-all"
                >
                  ← Trang chủ
                </Link>
                <div className="px-4 py-2 rounded-lg bg-white border border-[#e8e2d9] shadow-sm">
                  <span className="text-[#5a5349] text-sm">Điểm: </span>
                  <span className="font-bold text-[#2d5a27]">{score}</span>
                </div>
                <button
                  onClick={initGame}
                  className="px-4 py-2 rounded-lg bg-[#2d5a27] text-white text-sm font-medium hover:bg-[#23471f] transition-colors"
                >
                  Chơi lại
                </button>
                <button
                  onClick={() => setShowInstructions(!showInstructions)}
                  className="px-4 py-2 rounded-lg border border-[#e8e2d9] text-[#5a5349] text-sm font-medium hover:bg-white hover:shadow-sm transition-all"
                >
                  {showInstructions ? "Ẩn hướng dẫn" : "Xem hướng dẫn"}
                </button>
              </div>
            </div>
          </header>

          {/* Instructions Panel */}
          {showInstructions && (
            <div className="rounded-xl border border-[#e8e2d9] bg-white p-5 mb-6 max-w-3xl">
              <h3 className="font-bold text-[#1a1a1a] mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-[#e8e2d9] flex items-center justify-center text-sm">
                  📚
                </span>
                Hướng dẫn nhanh
              </h3>
              <div className="grid sm:grid-cols-3 gap-4 text-sm">
                <div className="p-4 rounded-lg bg-[#f5f1eb]">
                  <strong className="text-[#2d5a27]">1. Trả lời câu hỏi</strong>
                  <p className="text-[#5a5349] mt-1">
                    Nhập đáp án và nhấn "Trả lời"
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-[#f5f1eb]">
                  <strong className="text-[#2d5a27]">2. Mở khóa từ</strong>
                  <p className="text-[#5a5349] mt-1">
                    Đúng → Từ mở khóa (+10đ)
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-[#f5f1eb]">
                  <strong className="text-[#c41e3a]">3. Tìm từ</strong>
                  <p className="text-[#5a5349] mt-1">
                    Kéo chuột trên lưới (+20đ)
                  </p>
                </div>
              </div>
            </div>
          )}

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
              <QuestionPanel
                questions={questions}
                onAnswerSubmit={handleAnswerSubmit}
              />
            </div>
            <div className="flex justify-center">
              <WordGrid grid={grid} onWordFound={handleWordFound} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
