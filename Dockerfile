# syntax=docker/dockerfile:1
FROM node:16-alpine as builder

RUN apk add --update --no-cache curl git openssh openssl

USER node
WORKDIR /home/node

COPY --chown=node:node package*.json ./
COPY --chown=node:node yarn.lock ./
RUN yarn

RUN ssh-keygen -t rsa -b 4096 -m PEM -f jwt.key -P ""
RUN openssl rsa -in jwt.key -pubout -outform PEM -out jwt.key.pub

COPY --chown=node:node . .

ARG NODE_ENV=production
ARG APP_ENV=production

ENV NODE_ENV ${NODE_ENV}

RUN ["yarn", "build"]
CMD ["yarn", "prod"]
