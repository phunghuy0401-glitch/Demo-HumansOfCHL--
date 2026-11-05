# 19.11 — Chuyên Hạ Long · V3.2

Bản nâng cấp theo phong cách **lung linh, điện ảnh nhưng cân bằng**. V3.2 tăng chiều sâu chuyển động, hiệu ứng ánh sáng, hiệu ứng xuất hiện khi cuộn, phản hồi khi chạm và tinh chỉnh bố cục điện thoại. Khu vực video vẫn được ưu tiên ngay đầu trang; video thật sẽ được tích hợp khi có tệp media. Danh sách 36 lớp chuyên đã được điền sẵn theo cơ cấu 3 khối.

## Danh sách 36 lớp

Mỗi khối 10, 11, 12 gồm 12 lớp:

- Toán, Tin, Lý, Hóa, Sinh, Văn, Sử, Địa
- Anh 1, Anh 2
- Trung, Pháp

Tên lớp đã được khai báo trong `data.js`. Không cần thay tên mẫu nữa.

## Cấu trúc

- `index.html`: bố cục website; video nổi bật nằm ngay phần đầu.
- `style.css`: giao diện điện ảnh, hiệu ứng chuyển động, bố cục responsive cho điện thoại/máy tính và hỗ trợ giảm chuyển động theo cài đặt thiết bị.
- `app.js`: lọc lớp, tìm kiếm, mở lời nhắn, thư viện ảnh/video, đổi giao diện, hiệu ứng xuất hiện khi cuộn.
- `data.js`: dữ liệu 36 lớp, lời nhắn ngắn và danh sách media.
- `media/`: đặt video/ảnh tại đây.

## Thêm video (khi đã chọn video)

1. Đặt video vào thư mục `media/`, ví dụ `media/video-1911.mp4`.
2. Mở `data.js`, tìm `const MEDIA_ITEMS = [];` và thay bằng:

```js
const MEDIA_ITEMS = [
  {
    title: "Video 19.11",
    src: "media/video-1911.mp4",
    type: "video",
    poster: "media/poster-1911.jpg"
  },
  {
    title: "Khoảnh khắc ở trường",
    src: "media/khoanh-khac.jpg",
    type: "image"
  }
];
```

3. Video đầu tiên trong danh sách (hoặc video đầu tiên tìm thấy) sẽ tự động được chọn và hiển thị ở khung lớn ngay đầu website. Người xem chỉ cần nhấn nút phát.
4. Tải cả `data.js` đã sửa và thư mục `media/` lên repository GitHub Pages.

Nên dùng MP4 (H.264/AAC), 720p hoặc 1080p, dung lượng đã nén hợp lý. Ảnh poster là tùy chọn. Không bật tự phát âm thanh để tránh làm phiền người xem.

## Đưa lên GitHub Pages

Giải nén ZIP và tải toàn bộ nội dung bên trong thư mục `19.11_Chuyen_Ha_Long_V3` lên repository. Giữ nguyên cấu trúc và tên file. Website không yêu cầu đăng nhập, không có mã quản trị và không có chức năng upload từ khách truy cập; khách xem nội dung do chủ website đã đưa lên.

## Lưu ý

- Website không dùng cơ sở dữ liệu; media phải được đưa lên cùng repository.
- Đường dẫn media phân biệt chữ hoa/chữ thường trên máy chủ.
- Tìm kiếm lớp không phân biệt dấu tiếng Việt.
- Giao diện sáng/tối được lưu riêng trên trình duyệt của từng người.


## Kiểm tra V3.2

- Đã kiểm tra cú pháp JavaScript bằng Node.js.
- Đã phân tích HTML và xác nhận 36 mục dữ liệu lớp.
- CSS có breakpoint cho điện thoại nhỏ, điện thoại phổ thông, tablet và desktop; vùng thư viện cuộn ngang trên điện thoại.
- Đã thêm `prefers-reduced-motion` để tôn trọng thiết lập giảm chuyển động của thiết bị.
- Chưa thể xác nhận trên mọi mẫu điện thoại thực tế; nên mở thử bằng trình duyệt điện thoại sau khi đăng GitHub Pages.
