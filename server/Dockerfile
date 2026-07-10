# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Install build tools for native modules
RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm install   # install all deps including dev

COPY . .
RUN npm run build

# Stage 2: Runtime
FROM node:20-alpine AS runner
WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev   # only production deps

COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node","dist/index.js"]
