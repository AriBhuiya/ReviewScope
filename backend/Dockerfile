# Stage 1: Build the Go binary
FROM golang:1.24 AS builder

WORKDIR /app

# Copy go.mod and go.sum first to cache deps
COPY go.mod go.sum ./
RUN go mod download

COPY . .

# Build the binary
RUN CGO_ENABLED=0 GOOS=linux go build -o backend ./cmd/main.go

# Stage 2: runtime image
FROM alpine:latest

WORKDIR /root/

# Copy binary from builder
COPY --from=builder /app/backend .

# Optional: CA certs for future-proofing
RUN apk --no-cache add ca-certificates

CMD ["./backend"]
