# Stage 1: Build the React app
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json ./
RUN npm config set fetch-retry-maxtimeout 120000 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retries 5 && \
    npm install --legacy-peer-deps

# Empty string → Axios uses relative URLs → Nginx proxy handles /api/* → backend
ARG VITE_BASE_URL=""
ENV VITE_BASE_URL=$VITE_BASE_URL

COPY . .
RUN NODE_OPTIONS="--max-old-space-size=4096" npm run build

# Stage 2: Serve with Nginx over HTTP
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 5173

CMD ["nginx", "-g", "daemon off;"]
