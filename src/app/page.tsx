"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-8">
      <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4 text-gray-800">
            🎮 Trivia Word Search
          </h1>
          <p className="text-2xl text-gray-600">
            Trò chơi lịch sử Đảng Cộng sản Việt Nam
          </p>
          <p className="text-lg text-gray-500 mt-2">
            Trắc nghiệm trực quan cho 2 đội
          </p>
        </div>

        <div className="mb-12 grid md:grid-cols-2 gap-6">
          <Link
            href="/demo"
            className="group block p-10 bg-linear-to-br from-green-500 to-green-600 rounded-2xl hover:shadow-2xl transition-all hover:scale-105"
          >
            <div className="text-center text-white">
              <div className="text-7xl mb-4">🎓</div>
              <h2 className="text-3xl font-bold mb-3">Demo Game</h2>
              <p className="text-green-100 text-lg">
                Chế độ thực hành - Không giới hạn thời gian
              </p>
            </div>
          </Link>

          <Link
            href="/multiplayer"
            className="group block p-10 bg-linear-to-br from-purple-500 to-purple-600 rounded-2xl hover:shadow-2xl transition-all hover:scale-105"
          >
            <div className="text-center text-white">
              <div className="text-7xl mb-4">👥</div>
              <h2 className="text-3xl font-bold mb-3">Thi đấu</h2>
              <p className="text-purple-100 text-lg">
                2 Đội thi đấu - Có thời gian đếm ngược
              </p>
            </div>
          </Link>
        </div>

        <div className="bg-gray-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold mb-4 text-gray-800 text-center">
            📚 Cách chơi
          </h3>
          <div className="space-y-4 text-gray-700">
            <div className="flex items-start gap-3">
              <span className="text-2xl">1️⃣</span>
              <div>
                <strong className="text-lg">2 đội chơi luân phiên</strong>
                <p>Mỗi đội có bộ câu hỏi riêng biệt</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">2️⃣</span>
              <div>
                <strong className="text-lg">60 giây mỗi lượt</strong>
                <p>Trả lời câu hỏi đúng để mở khóa từ (+10 điểm)</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">3️⃣</span>
              <div>
                <strong className="text-lg">Tìm từ trên lưới</strong>
                <p>Kéo chuột qua các chữ cái để tìm từ (+20 điểm)</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">4️⃣</span>
              <div>
                <strong className="text-lg">
                  Đội nào nhiều điểm hơn thắng!
                </strong>
                <p>Phù hợp để chiếu lên màn hình lớn</p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-xl">
            <p className="text-center text-gray-700">
              <strong>� Nội dung:</strong> 30 câu hỏi về lịch sử Đảng Cộng sản
              Việt Nam
              <br />
              Mỗi đội nhận 15 câu hỏi khác nhau từ cùng bộ đề
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
