FROM node:12-alpine

WORKDIR /app

COPY package.json yarn.lock /app/

RUN \
  yarn --silent --no-progress --frozen-lockfile && \
  yarn build

FROM node:12-alpine
COPY . .
RUN \
  yarn --silent --prod && \
  yarn cache clean

EXPOSE 3000
ENTRYPOINT ["node"]
CMD ["./src/index.js"]
