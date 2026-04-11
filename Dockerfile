# ---- Build stage ----
FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src

RUN npm run build

# ---- Production stage ----
FROM node:22-alpine AS production

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist

# Drizzle migrations
COPY drizzle ./drizzle
COPY drizzle.config.ts ./
COPY src/configs ./src/configs
COPY src/db/schema ./src/db/schema

EXPOSE 3000

CMD ["node", "dist/index.js"]
