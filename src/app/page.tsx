"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#faf8f5] relative overflow-hidden">
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231a1a1a' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative min-h-screen flex flex-col items-center justify-center p-6 sm:p-8 lg:p-12">
        <div className="w-full max-w-3xl">
          {/* Header */}
          <header className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#e8e2d9]/80 text-[#5a5349] text-sm font-medium mb-8">
              <span className="w-2 h-2 rounded-full bg-[#c41e3a] animate-pulse" />
              Trò chơi trắc nghiệm
            </div>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1a1a1a] mb-4 tracking-tight"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              Trivia Word Search
            </h1>
            <p className="text-xl sm:text-2xl text-[#5a5349] font-medium">
              Lịch sử Đảng Cộng sản Việt Nam
            </p>
            <p className="text-[#8a8278] mt-2 text-lg">
              Thi đấu trực quan cho 2 đội
            </p>
          </header>

          {/* Game mode cards */}
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-12">
            <Link
              href="/demo"
              className="group relative overflow-hidden rounded-2xl bg-white border border-[#e8e2d9] p-8 shadow-sm hover:shadow-xl hover:border-[#d4a853]/40 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-bl from-[#2d5a27]/10 to-transparent rounded-bl-full" />
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-[#2d5a27]/10 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
                  🎓
                </div>
                <h2
                  className="text-2xl font-bold text-[#1a1a1a] mb-2"
                  style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                >
                  Demo Game
                </h2>
                <p className="text-[#5a5349] leading-relaxed">
                  Chế độ thực hành — Không giới hạn thời gian
                </p>
                <span className="inline-flex items-center gap-2 mt-4 text-[#2d5a27] font-medium opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                  Bắt đầu
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
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </div>
            </Link>

            <Link
              href="/multiplayer"
              className="group relative overflow-hidden rounded-2xl bg-white border border-[#e8e2d9] p-8 shadow-sm hover:shadow-xl hover:border-[#c41e3a]/40 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-bl from-[#c41e3a]/10 to-transparent rounded-bl-full" />
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-[#c41e3a]/10 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
                  👥
                </div>
                <h2
                  className="text-2xl font-bold text-[#1a1a1a] mb-2"
                  style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                >
                  Thi đấu
                </h2>
                <p className="text-[#5a5349] leading-relaxed">
                  2 đội thi đấu — Có thời gian đếm ngược
                </p>
                <span className="inline-flex items-center gap-2 mt-4 text-[#c41e3a] font-medium opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                  Bắt đầu
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
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </div>
            </Link>
          </div>

          {/* How to play */}
          <section className="rounded-2xl border border-[#e8e2d9] bg-white/80 backdrop-blur p-6 sm:p-8">
            <h3
              className="text-xl font-bold text-[#1a1a1a] mb-6 flex items-center gap-3"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              <span className="w-8 h-8 rounded-lg bg-[#d4a853]/20 flex items-center justify-center text-sm">
                📚
              </span>
              Cách chơi
            </h3>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#e8e2d9] flex items-center justify-center text-sm font-bold text-[#5a5349]">
                  1
                </span>
                <div>
                  <strong className="block text-[#1a1a1a] mb-0.5">
                    2 đội chơi luân phiên
                  </strong>
                  <p className="text-[#5a5349] text-sm">
                    Mỗi đội có bộ câu hỏi riêng biệt
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#e8e2d9] flex items-center justify-center text-sm font-bold text-[#5a5349]">
                  2
                </span>
                <div>
                  <strong className="block text-[#1a1a1a] mb-0.5">
                    120 giây mỗi lượt
                  </strong>
                  <p className="text-[#5a5349] text-sm">
                    Trả lời đúng để mở từ (+10 điểm)
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#e8e2d9] flex items-center justify-center text-sm font-bold text-[#5a5349]">
                  3
                </span>
                <div>
                  <strong className="block text-[#1a1a1a] mb-0.5">
                    Tìm từ trên lưới
                  </strong>
                  <p className="text-[#5a5349] text-sm">
                    Kéo chuột qua chữ cái (+20 điểm)
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#e8e2d9] flex items-center justify-center text-sm font-bold text-[#5a5349]">
                  4
                </span>
                <div>
                  <strong className="block text-[#1a1a1a] mb-0.5">
                    Đội nhiều điểm hơn thắng!
                  </strong>
                  <p className="text-[#5a5349] text-sm">
                    Phù hợp chiếu màn hình lớn
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6 p-4 rounded-xl bg-[#f5f1eb] border border-[#e8e2d9]">
              <p className="text-[#5a5349] text-center text-sm">
                <strong className="text-[#1a1a1a]">📖 Nội dung:</strong> 30 câu
                hỏi về lịch sử Đảng Cộng sản Việt Nam. Mỗi đội nhận 15 câu khác
                nhau từ cùng bộ đề.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
