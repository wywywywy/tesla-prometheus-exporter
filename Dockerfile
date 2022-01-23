FROM node:14.17.3-alpine AS base
WORKDIR /app
RUN apk add --no-cache curl

FROM base AS build
ENV NODE_ENV=development
RUN npm i -g npm@6
COPY . .
RUN npm ci --no-audit
RUN npm audit fix
RUN npm run build

FROM base AS release
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./
COPY package*.json ./
COPY *.md ./
EXPOSE 9885
CMD [ "node", "tesla-prometheus-exporter.js" ]
