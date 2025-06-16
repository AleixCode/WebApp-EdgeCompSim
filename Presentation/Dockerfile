# Stage 1: Build the app
FROM node:18 AS builder

WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm install

# Copy source and build
COPY . .
RUN npm run build

# Stage 2: Serve the app
FROM node:18-slim

WORKDIR /app

# Install a simple static server
RUN npm install -g serve

# Copy the Vite output (dist/) from the builder
COPY --from=builder /app/dist ./dist

EXPOSE 80

# Serve the build folder on port 80
CMD ["serve", "-s", "dist", "-l", "80"]
