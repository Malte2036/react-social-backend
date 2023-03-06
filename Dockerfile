FROM node:14-alpine AS builder
WORKDIR "/app"
COPY . .
RUN npm ci
RUN npm run build
RUN npm prune --production

FROM node:14-alpine AS production
RUN apk update
RUN apk add --no-cache make gcc g++ python3
WORKDIR "/app"
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
RUN npm install
RUN npm rebuild bcrypt --build-from-source
RUN apk del make gcc g++ python3

CMD [ "sh", "-c", "npm run start:prod"]
