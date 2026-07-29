FROM node:22.12-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json tsconfig.json ./
COPY src/ ./src/

RUN --mount=type=cache,target=/root/.npm npm ci


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

# mcp-proxy bridges stdio MCP servers to HTTP/SSE so this can run as a service in Kubernetes.
# Pin mcp: mcp-proxy 0.12.0 imports request_ctx from mcp.server.lowlevel.server,
# which newer mcp releases removed — leaving mcp unpinned produced crash-looping images.
RUN apk add --no-cache python3 py3-pip && \
    pip install --no-cache-dir --break-system-packages 'mcp-proxy==0.12.0' 'mcp==1.28.1' && \
    apk del py3-pip

COPY --from=builder /app/build /app/build
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/package-lock.json /app/package-lock.json

RUN npm ci --ignore-scripts --omit-dev && chown -R node:node /app

USER node

ENV NODE_ENV=production \
    MCP_PORT=8000

EXPOSE 8000

CMD ["sh", "-c", "mcp-proxy --port ${MCP_PORT} --host 0.0.0.0 --pass-environment -- node build/index.js"]
