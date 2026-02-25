import { Question } from "@/types/game";

// Bộ câu hỏi cho Đội 1 - Lịch sử Đảng Cộng sản Việt Nam (Phần 1)
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
      question: "Cơ quan ngôn luận của Đông Dương Cộng sản Đảng?",
      answer: "BUALIEM",
    },
    {
      question:
        "Tờ báo do Nguyễn Ái Quốc sáng lập năm 1925, mở đầu báo chí cách mạng Việt Nam?",
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
      question: "Tổ chức tiền thân trực tiếp của Đảng Cộng sản Việt Nam?",
      answer: "HOIVIETNAMCACHMANGTHANHVIEN",
    },
    {
      question: "Địa điểm diễn ra Hội nghị thành lập Đảng đầu năm 1930?",
      answer: "CUULONG",
    },
    {
      question: "Người chủ trì Hội nghị thành lập Đảng?",
      answer: "NGUYENAIQUOC",
    },
    {
      question: "Hai tổ chức trực tiếp hợp nhất tại Hội nghị thành lập Đảng?",
      answer: "DONGDUONGVAANNAM",
    },
  ];

// Bộ câu hỏi cho Đội 2 - Lịch sử Đảng Cộng sản Việt Nam (Phần 2)
export const team2Questions: Omit<Question, "id" | "isAnswered" | "isFound">[] =
  [
    {
      question:
        "Một trong hai đại biểu của Đông Dương Cộng sản Đảng dự Hội nghị thành lập Đảng?",
      answer: "NGUYENDUCCANH",
    },
    {
      question: "Tên chính thức của Đảng được thống nhất tại Hội nghị?",
      answer: "DANGCONGSANVIETNAM",
    },
    {
      question: "Vấn đề lịch sử lớn nhất được giải quyết khi Đảng ra đời?",
      answer: "KHOANGHOANGDUONGLOI",
    },
    {
      question: "Điều kiện tư tưởng quan trọng nhất để vào Đảng?",
      answer: "CHUNGHIACONGSAN",
    },
    {
      question: "Đại hội nào quyết định lấy ngày 3/2 làm ngày thành lập Đảng?",
      answer: "DAIHOIBA",
    },
    {
      question:
        "Mục tiêu chiến lược của cách mạng Việt Nam theo Cương lĩnh đầu tiên?",
      answer: "TUSANDANQUYEN",
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
      answer: "LUANCUONGCHINHTRỊ",
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
      question: "Cách mạng Việt Nam là một bộ phận của cuộc cách mạng nào?",
      answer: "CACHMANGVOSAN",
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

// Hàm tạo danh sách câu hỏi với ID cho Đội 1
export function createTeam1Questions(): Question[] {
  return team1Questions.map((q, index) => ({
    ...q,
    id: index + 1,
    isAnswered: false,
    isFound: false,
  }));
}

// Hàm tạo danh sách câu hỏi với ID cho Đội 2
export function createTeam2Questions(): Question[] {
  return team2Questions.map((q, index) => ({
    ...q,
    id: index + 1,
    isAnswered: false,
    isFound: false,
  }));
}

// Giữ lại hàm cũ để tương thích (sử dụng bộ câu hỏi đội 1)
export function createQuestions(): Question[] {
  return createTeam1Questions();
}
