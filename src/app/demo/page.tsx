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

  // Khởi tạo game demo
  const initGame = () => {
    const newQuestions = createDemoQuestions();
    const { grid: newGrid, wordPositions: newPositions } =
      generateGrid(newQuestions);

    setQuestions(newQuestions);
    setGrid(newGrid);
    setWordPositions(newPositions);
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
        q.id === questionId ? { ...q, isAnswered: true } : q,
      );
      setQuestions(updatedQuestions);
      setScore(score + 10);
      showMessage(
        `✓ Chính xác! Bây giờ hãy tìm từ "${correctAnswer}" trên lưới bên phải!`,
        "success",
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
          : q,
      );
      setQuestions(updatedQuestions);

      const updatedGrid = grid.map((row) =>
        row.map((cell) => {
          const isInFoundWord = cells.some(
            (c) => c.row === cell.row && c.col === cell.col,
          );
          return isInFoundWord ? { ...cell, isFound: true } : cell;
        }),
      );
      setGrid(updatedGrid);

      setScore(score + 20);
      showMessage(
        `🎉 Tuyệt vời! Bạn đã tìm thấy từ "${foundWord}"!`,
        "success",
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
      <div className="min-h-screen bg-linear-to-br from-green-50 to-emerald-100 flex items-center justify-center p-8">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-4xl w-full">
          <div className="text-center mb-8">
            <div className="text-7xl mb-4">🎓</div>
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              Chế độ Demo
            </h1>
            <p className="text-2xl text-gray-600">
              Làm quen với cách chơi trước khi thi đấu!
            </p>
          </div>

          <div className="bg-linear-to-r from-green-50 to-emerald-50 rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              📋 Hướng dẫn chi tiết
            </h2>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Đọc câu hỏi
                  </h3>
                  <p className="text-gray-700 text-lg">
                    Xem các câu hỏi ở panel bên trái. Nhập câu trả lời vào ô
                    input và nhấn "Trả lời".
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-green-500 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Mở khóa từ
                  </h3>
                  <p className="text-gray-700 text-lg">
                    Khi trả lời đúng, từ đó sẽ được "mở khóa" để tìm trên lưới.
                    Bạn nhận được <strong>+10 điểm</strong>.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-purple-500 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold shrink-0">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Tìm từ trên lưới
                  </h3>
                  <p className="text-gray-700 text-lg">
                    Nhấn và <strong>kéo chuột</strong> qua các chữ cái để chọn
                    từ (ngang/dọc/chéo). Tìm đúng nhận <strong>+20 điểm</strong>
                    .
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-yellow-500 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold shrink-0">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Hoàn thành
                  </h3>
                  <p className="text-gray-700 text-lg">
                    Trả lời đúng và tìm hết tất cả các từ để hoàn thành game!
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-3">
              <span className="text-3xl">💡</span>
              <div>
                <h3 className="font-bold text-lg text-gray-800 mb-2">
                  Lưu ý quan trọng:
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Demo không có giới hạn thời gian - chơi thoải mái!</li>
                  <li>• Có 5 câu hỏi đơn giản để làm quen</li>
                  <li>• Kéo chuột theo đường thẳng (ngang/dọc/chéo)</li>
                  <li>• Phải trả lời đúng trước khi tìm từ</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <Link
              href="/"
              className="px-8 py-4 bg-gray-500 text-white text-xl font-bold rounded-xl hover:bg-gray-600 transition-colors"
            >
              ← Về trang chủ
            </Link>
            <button
              onClick={initGame}
              className="px-12 py-4 bg-green-500 text-white text-xl font-bold rounded-xl hover:bg-green-600 transition-colors shadow-lg"
            >
              🚀 Bắt đầu Demo
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Completed screen
  if (step === "completed") {
    return (
      <div className="min-h-screen bg-linear-to-br from-green-50 to-emerald-100 flex items-center justify-center p-8">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-2xl w-full text-center">
          <div className="text-8xl mb-6">🎉</div>
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Hoàn thành Demo!
          </h1>
          <p className="text-2xl text-gray-600 mb-6">
            Bạn đã hiểu cách chơi rồi đấy!
          </p>
          <div className="text-6xl font-bold text-green-600 mb-8">
            {score} điểm
          </div>

          <div className="bg-green-50 rounded-xl p-6 mb-8">
            <h3 className="font-bold text-xl text-gray-800 mb-3">
              ✓ Bạn đã nắm được:
            </h3>
            <ul className="space-y-2 text-gray-700 text-lg">
              <li>✓ Cách trả lời câu hỏi để mở khóa từ</li>
              <li>✓ Cách kéo chuột để tìm từ trên lưới</li>
              <li>✓ Hệ thống điểm số và hoàn thành game</li>
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <button
              onClick={initGame}
              className="px-8 py-4 bg-green-500 text-white text-xl font-bold rounded-xl hover:bg-green-600 transition-colors"
            >
              🔄 Chơi Demo lại
            </button>
            <Link
              href="/multiplayer"
              className="px-8 py-4 bg-purple-500 text-white text-xl font-bold rounded-xl hover:bg-purple-600 transition-colors"
            >
              🏆 Vào thi đấu thật
            </Link>
            <Link
              href="/"
              className="px-8 py-4 bg-gray-500 text-white text-xl font-bold rounded-xl hover:bg-gray-600 transition-colors"
            >
              🏠 Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Playing screen
  if (grid.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-green-50 to-emerald-100">
        <div className="text-2xl font-semibold text-gray-700">
          Đang tải demo...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 to-emerald-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-4xl">🎓</span>
            <h1 className="text-4xl font-bold text-gray-800">Chế độ Demo</h1>
            <span className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold">
              Không giới hạn thời gian
            </span>
          </div>
          <p className="text-gray-600 text-lg">
            Thực hành để hiểu rõ cách chơi
          </p>

          <div className="mt-4 flex justify-center gap-4">
            <Link
              href="/"
              className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors font-medium shadow"
            >
              ← Trang chủ
            </Link>
            <div className="bg-white px-6 py-3 rounded-lg shadow">
              <span className="text-gray-600">Điểm số: </span>
              <span className="text-2xl font-bold text-green-600">{score}</span>
            </div>
            <button
              onClick={initGame}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium shadow"
            >
              🔄 Chơi lại
            </button>
            <button
              onClick={() => setShowInstructions(!showInstructions)}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium shadow"
            >
              {showInstructions ? "👁️ Ẩn hướng dẫn" : "💡 Xem hướng dẫn"}
            </button>
          </div>
        </div>

        {/* Instructions Panel */}
        {showInstructions && (
          <div className="bg-linear-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 mb-6 max-w-4xl mx-auto">
            <h3 className="font-bold text-xl text-gray-800 mb-4 text-center">
              📚 Hướng dẫn nhanh
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white p-4 rounded-lg">
                <div className="text-2xl mb-2">1️⃣</div>
                <strong className="text-blue-600">Trả lời câu hỏi</strong>
                <p className="text-gray-600 mt-1">
                  Nhập đáp án vào ô bên trái và nhấn "Trả lời"
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <div className="text-2xl mb-2">2️⃣</div>
                <strong className="text-green-600">Mở khóa từ</strong>
                <p className="text-gray-600 mt-1">
                  Đáp án đúng → Từ được mở khóa (+10đ)
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <div className="text-2xl mb-2">3️⃣</div>
                <strong className="text-purple-600">Tìm từ</strong>
                <p className="text-gray-600 mt-1">
                  Kéo chuột qua chữ cái trên lưới (+20đ)
                </p>
              </div>
            </div>
          </div>
        )}

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
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Question Panel */}
          <div className="flex justify-center">
            <QuestionPanel
              questions={questions}
              onAnswerSubmit={handleAnswerSubmit}
            />
          </div>

          {/* Word Grid */}
          <div className="flex justify-center">
            <WordGrid grid={grid} onWordFound={handleWordFound} />
          </div>
        </div>
      </div>
    </div>
  );
}
