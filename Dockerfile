# Production Dockerfile for Next.js (multi-stage)
FROM node:20-alpine
WORKDIR /app

# Install runtime dependencies
COPY package*.json ./
RUN npm ci --production=true

# Copy source
COPY . ./

# Expose port and run in development mode (no build)
EXPOSE 3000
CMD ["npm", "start"]
