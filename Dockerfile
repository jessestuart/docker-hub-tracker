FROM node:12-alpine as builder

WORKDIR /app

COPY package.json yarn.lock .

RUN yarn --silent --no-progress --frozen-lockfile
COPY . /app/
RUN yarn build

FROM node:12-alpine
WORKDIR /app
COPY package.json yarn.lock /app/
COPY --from=builder dist/ /app/dist/
RUN \
  yarn --silent --prod && \
  yarn cache clean

ENTRYPOINT ["node"]
CMD ["./dist/index.js"]
