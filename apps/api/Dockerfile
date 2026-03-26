FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm@9

# Copy workspace files + lockfile
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY apps/api/package.json ./apps/api/
COPY packages/db/package.json ./packages/db/
COPY packages/redis/package.json ./packages/redis/
COPY packages/queue/package.json ./packages/queue/
COPY packages/types/package.json ./packages/types/

# Install all dependencies
RUN pnpm install --no-frozen-lockfile

# Copy source
COPY apps/api ./apps/api
COPY packages ./packages

# Build packages
RUN cd packages/db    && pnpm exec tsc --outDir dist --module commonjs --target ES2021 --esModuleInterop true --skipLibCheck src/index.ts || true
RUN cd packages/redis && pnpm exec tsc --outDir dist --module commonjs --target ES2021 --esModuleInterop true --skipLibCheck src/index.ts || true
RUN cd packages/types && pnpm exec tsc --outDir dist --module commonjs --target ES2021 --esModuleInterop true --skipLibCheck src/index.ts || true

# Update package.json main fields
RUN node -e "const p=require('./packages/db/package.json');p.main='./dist/index.js';require('fs').writeFileSync('./packages/db/package.json',JSON.stringify(p,null,2))"
RUN node -e "const p=require('./packages/redis/package.json');p.main='./dist/index.js';require('fs').writeFileSync('./packages/redis/package.json',JSON.stringify(p,null,2))"
RUN node -e "const p=require('./packages/types/package.json');p.main='./dist/index.js';require('fs').writeFileSync('./packages/types/package.json',JSON.stringify(p,null,2))"

# Build API
WORKDIR /app/apps/api
RUN pnpm exec nest build

# Production image
FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm@9

COPY package.json pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/db/package.json ./packages/db/
COPY packages/redis/package.json ./packages/redis/
COPY packages/queue/package.json ./packages/queue/
COPY packages/types/package.json ./packages/types/

RUN pnpm install --no-frozen-lockfile --prod

# Copy built files
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/packages/db/dist ./packages/db/dist
COPY --from=builder /app/packages/redis/dist ./packages/redis/dist
COPY --from=builder /app/packages/types/dist ./packages/types/dist

WORKDIR /app/apps/api

EXPOSE 3001

CMD ["node", "dist/main"]
