FROM node:20-alpine

# Install FFmpeg
RUN apk add --no-cache ffmpeg

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY ../../packages/shared/package.json ./packages/shared/

# Install dependencies
RUN npm install

# Copy source code
COPY . .
COPY ../../packages/shared ./packages/shared

# Build the application
RUN npm run build

# Create storage directory
RUN mkdir -p /app/storage

EXPOSE 3001

CMD ["npm", "start"]
