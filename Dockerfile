FROM node:20-alpine AS builder
WORKDIR /app

# Copy root package.json and install dependencies
COPY package*.json ./
RUN npm ci

# Copy frontend source and its package.json, install dependencies, and build
COPY src/client/package*.json ./src/client/
RUN cd src/client && npm ci
COPY src/client/ ./src/client/
RUN cd src/client && npm run build

# Copy remaining backend source and build backend
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app

# Copy root package.json and install production dependencies
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy built backend and frontend assets
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/client/dist ./src/client/dist

RUN chown -R node:node /app
USER node
EXPOSE 3001
CMD ["npm", "start"]