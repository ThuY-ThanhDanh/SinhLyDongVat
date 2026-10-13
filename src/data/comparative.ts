export interface ComparativeItem {
  system: string;
  feature: string;
  species: {
    name: string;
    description: string;
    clinicalPearl: string;
  }[];
}

export const COMPARATIVE_DATA: ComparativeItem[] = [
  {
    system: "Hệ Tiết Niệu (Thận)",
    feature: "Hình thái quả thận & Cấu trúc bài xuất",
    species: [
      {
        name: "Bò (Bovine)",
        description: "Thận có nhiều thùy (15-25 thùy), bề mặt có nhiều rãnh sâu phân chia rõ rệt.",
        clinicalPearl: "Dễ chẩn đoán nhầm với bệnh lý nếu không nắm vững giải phẫu sinh lý bò bình thường."
      },
      {
        name: "Ngựa (Equine)",
        description: "Thận phải hình trái tim đặc trưng, thận trái hình hạt đậu bất đối xứng.",
        clinicalPearl: "Nước tiểu ngựa đục và nhầy do chứa nhiều chất nhầy và tinh thể Canxi Carbonate (CaCO₃)."
      },
      {
        name: "Heo (Porcine)",
        description: "Hình hạt đậu thuôn dài, dẹp hai bên, bề mặt trơn nhẵn.",
        clinicalPearl: "Cấu trúc vi thể và kích thước thận heo gần gũi nhất với thận người, thường dùng trong cấy ghép dị chủng."
      },
      {
        name: "Chó & Mèo (Carnivore)",
        description: "Hình hạt đậu điển hình, bề mặt trơn nhẵn bóng, rốn thận có lớp mỡ đệm dày.",
        clinicalPearl: "Mèo rất dễ bị hội chứng tắc nghẽn đường tiểu dưới (FLUTD) và suy thận mạn tính (CKD)."
      },
      {
        name: "Gia Cầm (Avian)",
        description: "Thận kéo dài 3 thùy nằm áp sát vào hõm xương chậu; KHÔNG CÓ BÀNG QUANG.",
        clinicalPearl: "Nước tiểu đổ thẳng vào xoang huyệt, sản phẩm bài tiết nitơ chính là Acid Uric sệt trắng đục."
      }
    ]
  },
  {
    system: "Hệ Máu (Huyết Học)",
    feature: "Hình thái tế bào máu & Nhóm máu",
    species: [
      {
        name: "Thú có vú (Chó, Mèo, Bò, Heo)",
        description: "Hồng cầu hình đĩa lõm hai mặt, KHÔNG CÓ NHÂN; tiểu cầu là các mảnh tế bào không nhân.",
        clinicalPearl: "Hình đĩa lõm tối ưu hóa diện tích tiếp xúc với O₂ và giúp tế bào uốn cong linh hoạt qua mao mạch."
      },
      {
        name: "Lớp Chim / Gia Cầm (Gà, Vịt)",
        description: "Hồng cầu hình bầu dục CÓ NHÂN; tiểu cầu (Thrombocyte) là tế bào hoàn chỉnh CÓ NHÂN.",
        clinicalPearl: "BẪY THI: Đưa mẫu máu gia cầm vào máy đếm tự động gia súc sẽ làm tắc nghẽn buồng đếm và sai lệch kết quả."
      },
      {
        name: "Chó (Canine)",
        description: "Hệ nhóm máu DEA (Dog Erythrocyte Antigen: DEA 1.1, 1.2...); không có kháng thể tự nhiên.",
        clinicalPearl: "Lần truyền máu đầu tiên ở chó tương đối an toàn, nhưng sẽ kích hoạt sinh kháng thể gây tán huyết nếu truyền lần hai."
      },
      {
        name: "Mèo (Feline)",
        description: "Hệ nhóm máu AB (A, B, AB); chứa nồng độ kháng thể tự nhiên rất cao trong huyết tương.",
        clinicalPearl: "BẮT BUỘC định nhóm máu trước khi truyền! Mèo nhóm B nhận máu nhóm A sẽ bị sốc phản vệ tử vong ngay tức thì."
      }
    ]
  },
  {
    system: "Hệ Tiêu Hóa",
    feature: "Cấu tạo dạ dày & Quá trình lên men",
    species: [
      {
        name: "Gia súc nhai lại (Trâu, Bò, Dê, Cừu)",
        description: "Dạ dày 4 túi: Dạ cỏ (Rumen), Dạ tổ ong (Reticulum), Dạ lá sách (Omasum), Dạ múi khế (Abomasum).",
        clinicalPearl: "Dạ múi khế mới là dạ dày thực sự tiết dịch vị acid HCl và Pepsin; 3 túi trước là dạ dày tuyến trước lên men vi sinh vật."
      },
      {
        name: "Động vật đơn vị (Chó, Mèo, Heo, Người)",
        description: "Dạ dày đơn 1 túi, tiêu hóa chủ yếu bằng enzyme nội sinh tiết ra từ dạ dày và ruột non.",
        clinicalPearl: "Không có khả năng tiêu hóa rơm rạ cellulose hiệu quả như động vật nhai lại."
      },
      {
        name: "Ngựa (Đơn vị ăn cỏ)",
        description: "Dạ dày đơn nhỏ, nhưng Manh tràng (Cecum) và Kết tràng khổng lồ đóng vai trò như dạ cỏ lên men chất xơ.",
        clinicalPearl: "Ngựa không thể ợ hơi hoặc nôn mửa; chướng hơi hoặc xoắn ruột dễ dẫn đến cơn đau bụng ngoại khoa (Colic) gây tử vong."
      }
    ]
  }
];
