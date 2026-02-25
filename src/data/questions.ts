import { Question } from "@/types/game";

// ================= TEAM 1 =================
export const team1Questions: Omit<Question, "id" | "isAnswered" | "isFound">[] =
  [
    {
      question:
        "Đảng Cộng sản Việt Nam là kết quả của sự kết hợp giữa chủ nghĩa Mác – Lênin với hai phong trào nào?",
      answer: "CONGNHANVAYEUNUOC",
    },
    {
      question:
        "Nguyễn Ái Quốc trở thành người cộng sản khi tham gia sáng lập đảng nào năm 1920?",
      answer: "DANGCONGSANPHAP",
    },
    {
      question: "Giai cấp chiếm hơn 90% dân số Việt Nam dưới thời Pháp thuộc?",
      answer: "NONGDAN",
    },
    {
      question: "Tổ chức cộng sản đầu tiên được thành lập ở Việt Nam năm 1929?",
      answer: "DONGDUONGCONGSANDANG",
    },
    {
      question:
        "Tác phẩm lý luận năm 1927 của Nguyễn Ái Quốc chuẩn bị cho việc thành lập Đảng?",
      answer: "DUONGCACHMENH",
    },
    {
      question: "Nguyễn Ái Quốc ra tờ báo nào năm 1925?",
      answer: "THANHNIEN",
    },
    {
      question:
        "Sau khởi nghĩa Yên Bái, khuynh hướng nào không còn khả năng lãnh đạo cách mạng Việt Nam?",
      answer: "DANCHUTUSAN",
    },
    {
      question:
        "Theo Nguyễn Ái Quốc, ngoài công – nông thì các giai cấp khác là gì của cách mạng?",
      answer: "BAUBANCACHMANG",
    },
    {
      question: "An Nam Cộng sản Đảng được thành lập tại thành phố nào?",
      answer: "SAIGON",
    },
    {
      question:
        "Phong trào do Hội Việt Nam Cách mạng Thanh niên phát động năm 1928?",
      answer: "VOSANHOA",
    },
    {
      question:
        "Tổ chức tiền thân trực tiếp của Đảng Cộng sản Việt Nam còn gọi là Hội gì?",
      answer: "HOITHANHNIEN",
    },
    {
      question: "Hội nghị thành lập Đảng đầu năm 1930 diễn ra tại đâu?",
      answer: "HUONGCANG",
    },
    {
      question: "Người chủ trì Hội nghị thành lập Đảng?",
      answer: "NGUYENAIQUOC",
    },
    {
      question:
        "Có bao nhiêu tổ chức cộng sản được hợp nhất tại Hội nghị đầu năm 1930?",
      answer: "BA",
    },
    {
      question:
        "Một trong hai đại biểu của Đông Dương Cộng sản Đảng dự Hội nghị thành lập Đảng?",
      answer: "NGUYENDUCCANH",
    },
  ];

// ================= TEAM 2 =================
export const team2Questions: Omit<Question, "id" | "isAnswered" | "isFound">[] =
  [
    {
      question: "Cương lĩnh chính trị đầu tiên của Đảng do ai soạn thảo?",
      answer: "NGUYENAIQUOC",
    },
    {
      question: "Tên chính thức của Đảng được thống nhất tại Hội nghị?",
      answer: "DANGCONGSANVIETNAM",
    },
    {
      question: "Hội nghị thành lập Đảng diễn ra vào năm nào?",
      answer: "1930",
    },
    {
      question: "Điều kiện tư tưởng quan trọng nhất để vào Đảng?",
      answer: "CHUNGHIAMACLENIN",
    },
    {
      question: "Ngày thành lập Đảng Cộng sản Việt Nam?",
      answer: "3THANG21930",
    },
    {
      question:
        "Theo Cương lĩnh đầu tiên, cách mạng Việt Nam phải trải qua mấy giai đoạn?",
      answer: "HAI",
    },
    {
      question: "Nhiệm vụ hàng đầu của cách mạng Việt Nam theo Cương lĩnh?",
      answer: "DOCLAPDANTOC",
    },
    {
      question: "Lực lượng nòng cốt của cách mạng Việt Nam?",
      answer: "CONGNONG",
    },
    {
      question: "Văn kiện không thuộc Cương lĩnh chính trị đầu tiên?",
      answer: "LUANCUONGCHINHTRI",
    },
    {
      question: "Giai cấp lãnh đạo cách mạng Việt Nam?",
      answer: "GIAICAPCONGNHAN",
    },
    {
      question: "Phương pháp tiến hành cách mạng theo Cương lĩnh đầu tiên?",
      answer: "BAOLUCCACHMANG",
    },
    {
      question:
        "Cách mạng Việt Nam gắn liền với phong trào cách mạng của giai cấp nào trên thế giới?",
      answer: "CONGNHAN",
    },
    {
      question: "Địa điểm thành lập chi bộ cộng sản đầu tiên ở Việt Nam?",
      answer: "HAMLONG",
    },
    {
      question:
        "Tổ chức đã chỉ thị cho Nguyễn Ái Quốc hợp nhất các tổ chức cộng sản?",
      answer: "QUOCTECONGSAN",
    },
    {
      question: "Thời điểm bắt đầu Hội nghị hợp nhất các tổ chức cộng sản?",
      answer: "THANGMOT1930",
    },
  ];

// ================= FUNCTIONS =================
export function createTeam1Questions(): Question[] {
  return team1Questions.map((q, index) => ({
    ...q,
    id: index + 1,
    isAnswered: false,
    isFound: false,
  }));
}

export function createTeam2Questions(): Question[] {
  return team2Questions.map((q, index) => ({
    ...q,
    id: index + 1,
    isAnswered: false,
    isFound: false,
  }));
}

// Giữ tương thích cũ
export function createQuestions(): Question[] {
  return createTeam1Questions();
}
