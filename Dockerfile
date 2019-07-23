FROM node:12-alpine as builder

WORKDIR /app

COPY package.json yarn.lock /app/

RUN yarn --silent --no-progress --frozen-lockfile
COPY . /app/
RUN yarn build

FROM node:12-alpine
WORKDIR /app
COPY package.json yarn.lock /app/
COPY --from=builder /app/dist/ /app/dist/
RUN \
  yarn --silent --prod && \
  yarn cache clean

ENV AWS_ACCESS_KEY_ID ''
ENV AWS_SECRET_ACCESS_KEY ''
ENTRYPOINT ["node"]
CMD ["./dist/index.js"]
