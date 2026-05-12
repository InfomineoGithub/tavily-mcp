FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies first (cache layer)
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --ignore-scripts

# Copy source and build
COPY tsconfig.json ./
COPY src/ ./src/
RUN npm run build

# ── Production image ──────────────────────────────────────────────────────────
FROM node:22-alpine AS release

ENV NODE_ENV=production \
    MCP_TRANSPORT=streamable-http \
    MCP_HOST=0.0.0.0 \
    MCP_PORT=8000

WORKDIR /app

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy built artefacts and production deps from builder
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json

RUN --mount=type=cache,target=/root/.npm npm ci --omit=dev --ignore-scripts

USER appuser

EXPOSE 8000

CMD ["node", "build/index.js"]
