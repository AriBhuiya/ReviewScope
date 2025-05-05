# Use legacy-compatible Node base image
FROM node:18 AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy rest of the app and build it
COPY . .
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Serve using Nginx
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

# Custom Nginx config (optional)
COPY nginx.conf /etc/nginx/conf.d/default.conf