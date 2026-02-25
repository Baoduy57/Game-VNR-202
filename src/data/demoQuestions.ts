import { Question } from "@/types/game";

// Bộ câu hỏi Demo - Đơn giản để làm quen
export const demoQuestions: Omit<Question, "id" | "isAnswered" | "isFound">[] =
  [
    {
      question: "Thủ đô của Việt Nam?",
      answer: "HANOI",
    },
    {
      question: "Vị lãnh tụ sáng lập Đảng Cộng sản Việt Nam?",
      answer: "NGUYENAIQUOC",
    },
    {
      question: "Thành phố lớn nhất Việt Nam?",
      answer: "SAIGON",
    },
    {
      question: "Ngày Quốc khánh Việt Nam?",
      answer: "HAITHANGCHIN",
    },
    {
      question: "Đảng Cộng sản Việt Nam được thành lập năm nào?",
      answer: "MOTCHINBAMUOI",
    },
  ];

// Hàm tạo danh sách câu hỏi demo với ID
export function createDemoQuestions(): Question[] {
  return demoQuestions.map((q, index) => ({
    ...q,
    id: index + 1,
    isAnswered: false,
    isFound: false,
  }));
}
