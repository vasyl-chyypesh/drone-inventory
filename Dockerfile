FROM node:20-alpine as base

FROM base as builder

WORKDIR /home/node/app
COPY tsconfig.json ./
COPY package*.json ./
COPY ./src ./src

RUN npm install
RUN npm run build

FROM base as runtime

ENV NODE_ENV=production
ENV PAYLOAD_CONFIG_PATH=dist/payload.config.js

WORKDIR /home/node/app
COPY package*.json  ./

RUN npm install --production
COPY --from=builder /home/node/app/dist ./dist
COPY --from=builder /home/node/app/build ./build

USER node
EXPOSE 3000

CMD ["node", "dist/server.js"]
