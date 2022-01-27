FROM node:14-alpine AS base
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache curl

FROM base AS build
COPY . .
RUN npm ci --production-only --no-audit
RUN npm audit fix
RUN npm run build

FROM base AS release
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./
COPY package*.json ./
COPY *.md ./
EXPOSE 9885
CMD [ "node", "tesla-prometheus-exporter.js" ]
