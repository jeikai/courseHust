# FunCourse — Hướng dẫn chạy dự án

## Cách 1: Chạy bằng Docker (khuyến nghị)

### Yêu cầu
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) đã được cài đặt và đang chạy

### Khởi động

```bash
docker compose up --build
```

Lần đầu chạy sẽ mất vài phút để build image. Những lần sau có thể bỏ `--build`:

```bash
docker compose up
```

### Truy cập

| Dịch vụ  | URL                        |
|----------|----------------------------|
| Frontend | https://localhost:5173     |
| Backend  | http://localhost:5500      |

> **Lưu ý:** Frontend dùng HTTPS với chứng chỉ tự ký. Trình duyệt sẽ hiển thị cảnh báo — chọn **"Advanced" → "Proceed to localhost"** để tiếp tục.

### Tài khoản mặc định (tự động tạo lần đầu)

| Role        | Email               | Mật khẩu |
|-------------|---------------------|-----------|
| Admin       | admin@gmail.com     | 1234567   |
| Instructor  | teacher@gmail.com   | 1234567   |

### Dữ liệu mẫu (tự động seed)

- **3 danh mục:** Programming, Design, Data Science (kèm 7 subcategory)
- **2 khoá học mẫu:**
  - *Introduction to Web Development* — miễn phí, 3 sections, 6 bài học
  - *Python for Data Science* — 199.000 VND, 3 sections, 5 bài học

### Dừng / Xoá

```bash
# Dừng containers (giữ lại dữ liệu MongoDB)
docker compose down

# Dừng và xoá toàn bộ dữ liệu (reset về trạng thái ban đầu)
docker compose down -v
```

---

## Cách 2: Chạy thủ công (local development)

### Yêu cầu
- Node.js >= 18, Yarn
- MongoDB đang chạy ở `localhost:27017`
- FFmpeg đã được cài đặt

### Cài đặt & khởi động

```bash
# Cài dependencies
yarn install

# Chạy backend (cổng 5500)
cd server
yarn dev

# Chạy frontend (cổng 5173) — mở terminal mới
cd client
yarn dev
```

Frontend: http://localhost:5173  
Backend:  http://localhost:5500

---

## Các tính năng chính

- Đăng ký / Đăng nhập tài khoản
- Quản lý khoá học (tạo, chỉnh sửa — role Teacher/Admin)
- Tạo quiz bằng cách kéo thả ảnh: http://localhost:5173/instructor_m/create_quiz
- Tạo khoá học mới (Admin): http://localhost:5173/admin/add_course
- Thanh toán qua VNPay (sandbox)

## Test bằng Postman

Import file JSON trong thư mục `test/` vào Postman để có sẵn collection các API endpoint.
