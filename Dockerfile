# Build 
FROM oven/bun:latest AS build

WORKDIR /app
COPY server/package.json server/bun.lockb ./server/
COPY client/package.json client/bun.lockb ./client/

ENV NODE_ENV=production

# Install dependencies
WORKDIR /app/server
RUN bun install
WORKDIR /app/client
RUN bun install

# Copy source
COPY server /app/server
COPY client /app/client

# Build the front-end
WORKDIR /app/client
RUN bun run build

####################
# Run
FROM oven/bun:slim

WORKDIR /app
COPY --from=build /app/client/dist ./client
COPY --from=build /app/server/package.json /app/server/bun.lockb ./
COPY --from=build /app/server/src ./src

ENV NODE_ENV=production

RUN bun install --production

EXPOSE 80

CMD ["bun", "run", "src/index.ts"]
