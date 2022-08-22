FROM node:alpine as build
RUN apk add --no-cache g++ make py3-pip
# RUN apk add --no-cache libc6-compat
ENV NODE_ENV=development
WORKDIR /usr/src/app
COPY package*.json yarn.lock ./
RUN yarn --dev install && yarn cache clean
COPY . .
RUN yarn build && yarn export

FROM umputun/nginx-le:latest as production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /usr/src/app
# serving static fe
COPY --from=build /usr/src/app/out /usr/share/nginx/html
