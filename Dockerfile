FROM node:12-alpine as builder

WORKDIR /app

COPY . .

RUN \
  yarn --silent --no-progress --frozen-lockfile && \
  yarn build

FROM node:12-alpine
WORKDIR /app
COPY package.json yarn.lock /app/
COPY --from=builder dist/ /app/dist/
RUN \
  yarn --silent --prod && \
  yarn cache clean

EXPOSE 3000
ENTRYPOINT ["node"]
CMD ["./dist/index.js"]
