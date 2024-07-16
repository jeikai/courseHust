FROM node:20.15-alpine AS build

# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép package.json và package-lock.json
COPY package*.json ./

# Cài đặt các dependency
RUN npm install

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Build ứng dụng
RUN npm run build

# Sử dụng image Nginx để phục vụ nội dung tĩnh
FROM nginx:alpine

# Sao chép các file build từ giai đoạn build vào thư mục html của Nginx
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port (thường React.js client chạy trên port 80)
# EXPOSE 3000

# Khởi chạy Nginx
CMD ["nginx", "-g", "daemon off;"]
