# 🎮 Trivia Word Search - Game Lịch Sử Đảng Cộng Sản Việt Nam

Game giáo dục kết hợp **Trắc nghiệm** và **Tìm từ** về lịch sử Đảng Cộng sản Việt Nam, được thiết kế cho hoạt động thi đấu giữa 2 đội.

## 📋 Tổng quan

Game này kết hợp hai thể loại chơi:

1. **Trắc nghiệm (Trivia)**: Trả lời các câu hỏi về lịch sử để mở khóa từ
2. **Tìm từ (Word Search)**: Tìm các từ đã mở khóa trên lưới 20×20 bằng cách kéo chuột

### ✨ Tính năng chính

- 🎓 **Chế độ Demo**: Thực hành với 5 câu hỏi đơn giản, không giới hạn thời gian
- 👥 **Chế độ Thi đấu**: 2 đội chơi luân phiên với 180 giây mỗi lượt
- 📚 **30 câu hỏi lịch sử**: Mỗi đội nhận 15 câu hỏi khác nhau về Đảng Cộng sản Việt Nam
- ⏱️ **Timer động**: Đếm ngược 180 giây tự động, hiển thị progress bar
- 🎯 **Hệ thống điểm**:
  - +10 điểm cho mỗi câu trả lời đúng
  - +20 điểm cho mỗi từ tìm được
- 🔤 **Lưới 20×20**: Hỗ trợ từ dài tới 27 ký tự (ngang/dọc/chéo)
- 📊 **Bảng điểm trực tiếp**: Theo dõi điểm số và tiến độ của từng đội
- 🎨 **UI thân thiện**: Giao diện đẹp mắt, phù hợp chiếu lên màn hình lớn

## 🛠️ Công nghệ sử dụng

- **Next.js** 16.1.6 (App Router)
- **React** 19.2.3
- **TypeScript** 5
- **Tailwind CSS** 4
- **Node.js** (LTS)

## 🚀 Cài đặt và Chạy

### Yêu cầu hệ thống

- Node.js 18.x trở lên
- npm, yarn, pnpm hoặc bun

### Bước 1: Clone repository

```bash
git clone <repository-url>
cd game
```

### Bước 2: Cài đặt dependencies

```bash
npm install
# hoặc
yarn install
# hoặc
pnpm install
# hoặc
bun install
```

### Bước 3: Chạy development server

```bash
npm run dev
# hoặc
yarn dev
# hoặc
pnpm dev
# hoặc
bun dev
```

Mở trình duyệt và truy cập [http://localhost:3000](http://localhost:3000)

### Build cho production

```bash
npm run build
npm start
```

## 🎯 Cách chơi

### Chế độ Demo (🎓 Demo Game)

Dành cho người chơi mới, làm quen với cách chơi:

1. Không giới hạn thời gian
2. 5 câu hỏi đơn giản
3. Hướng dẫn chi tiết từng bước
4. Phù hợp để luyện tập trước khi vào thi đấu

### Chế độ Thi đấu (👥 Multiplayer)

Thi đấu giữa 2 đội:

1. **Mỗi đội chơi luân phiên** - 180 giây mỗi lượt
2. **Trả lời câu hỏi**: Nhập đáp án để mở khóa từ (+10 điểm)
3. **Tìm từ trên lưới**: Kéo chuột qua các chữ cái để tìm từ đã mở khóa (+20 điểm)
4. **Chiến thắng**: Đội nào có nhiều điểm hơn khi hết câu hỏi

### Quy tắc chi tiết

- ⏰ Timer bắt đầu ngay khi đến lượt chơi
- ✅ Trả lời đúng → từ được mở khóa (màu xanh dương)
- 🔍 Chỉ tìm được từ đã mở khóa
- 🎯 Kéo chuột theo đường thẳng: ngang, dọc, chéo (4 hướng)
- ⏭️ Hết giờ → chuyển lượt sang đội kia
- 🏆 Đội nhiều điểm hơn thắng cuộc

## 📁 Cấu trúc Project

```
game/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Trang chủ - Menu chính
│   │   ├── demo/
│   │   │   └── page.tsx          # Chế độ Demo
│   │   └── multiplayer/
│   │       └── page.tsx          # Chế độ Thi đấu 2 đội
│   ├── components/
│   │   ├── QuestionPanel.tsx     # Panel hiển thị câu hỏi (Demo)
│   │   ├── TeamQuestionPanel.tsx # Panel câu hỏi với trạng thái (Multiplayer)
│   │   ├── WordGrid.tsx          # Lưới 20×20 tìm từ
│   │   ├── Timer.tsx             # Đồng hồ đếm ngược 60s
│   │   └── TeamScoreboard.tsx    # Bảng điểm 2 đội
│   ├── data/
│   │   ├── questions.ts          # 30 câu hỏi lịch sử (2 bộ × 15)
│   │   └── demoQuestions.ts      # 5 câu hỏi demo đơn giản
│   ├── types/
│   │   └── game.ts               # TypeScript types
│   └── utils/
│       └── gridGenerator.ts      # Logic tạo lưới và đặt từ
├── public/                       # Assets tĩnh
├── eslint.config.mjs
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## 📝 Nội dung câu hỏi

Game bao gồm **30 câu hỏi** về các chủ đề:

- 🏛️ Lịch sử thành lập Đảng
- 👤 Các lãnh tụ Đảng (Hồ Chí Minh, Trường Chinh, Lê Duẩn, v.v.)
- 📜 Các phong trào và sự kiện lịch sử
- 🎓 Học thuyết và tư tưởng Đảng
- 🌟 Các mốc thời gian quan trọng

Câu hỏi được chia đều cho 2 đội (mỗi đội 15 câu khác nhau).

## 🎨 Một số screenshots

_(Có thể thêm screenshots của game tại đây)_

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Vui lòng:

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📄 License

Project này được phát triển cho mục đích giáo dục.

## 🙏 Credits

- Built with [Next.js](https://nextjs.org)
- Styled with [Tailwind CSS](https://tailwindcss.com)
- Deployed on [Vercel](https://vercel.com)

---

**Phát triển bởi:** [Tên của bạn]  
**Phiên bản:** 1.0.0  
**Cập nhật lần cuối:** Tháng 2, 2026
