# Tumia Node 20 LTS mahususi
FROM node:20-alpine

# Install system dependencies kwa alpine
RUN apk update && \
    apk add --no-cache \
    ffmpeg \
    imagemagick \
    libwebp-tools \
    && npm i pm2 -g

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies bila legacy-peer-deps
RUN npm install

# Copy source code
COPY . .

EXPOSE 5000

# Suppress deprecation warnings
CMD ["node", "--no-deprecation", "index.js"]
