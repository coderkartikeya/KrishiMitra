
FROM node:18-alpine AS base
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# Copy source and build
COPY . .
ENV NODE_ENV=production
RUN npm run build

# Run
EXPOSE 3000
ENV PORT=3000
CMD ["npm", "start"]