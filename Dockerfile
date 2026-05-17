FROM node:22.12-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json tsconfig.json ./
COPY src/ ./src/

RUN --mount=type=cache,target=/root/.npm npm ci


FROM node:22-alpine AS release

WORKDIR /app

# mcp-proxy bridges stdio MCP servers to HTTP/SSE so this can run as a service in Kubernetes.
RUN apk add --no-cache python3 py3-pip && \
    pip install --no-cache-dir --break-system-packages mcp-proxy==0.12.0 && \
    apk del py3-pip

RUN addgroup -g 1000 app && adduser -D -u 1000 -G app -h /home/app -s /sbin/nologin app

COPY --from=builder /app/build /app/build
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/package-lock.json /app/package-lock.json

RUN npm ci --ignore-scripts --omit-dev && chown -R app:app /app

USER app

ENV NODE_ENV=production \
    MCP_PORT=8000

EXPOSE 8000

CMD ["sh", "-c", "mcp-proxy --port ${MCP_PORT} --host 0.0.0.0 --pass-environment -- node build/index.js"]
