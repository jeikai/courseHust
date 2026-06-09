FROM node:20-alpine

# Build tools for native npm addons (canvas, image-to-pdf/libjpeg, tesseract)
RUN apk add --no-cache \
    ffmpeg \
    python3 \
    make \
    g++ \
    gcc \
    nasm \
    autoconf \
    automake \
    libtool \
    cairo-dev \
    pango-dev \
    jpeg-dev \
    giflib-dev \
    librsvg-dev \
    pkgconfig

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN chmod +x /app/entrypoint.sh

EXPOSE 5500

ENTRYPOINT ["/app/entrypoint.sh"]
