FROM node:alpine as build
RUN apk add --no-cache g++ make py3-pip
# RUN apk add --no-cache libc6-compat
ENV NODE_ENV=development
WORKDIR /usr/src/app
COPY package*.json yarn.lock ./
RUN yarn --dev install && yarn cache clean
COPY . .
RUN yarn build

# SELF HOSTING nodejs container
FROM nginx:stable-alpine as production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /usr/src/app
# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs
# from build
COPY --from=build /usr/src/app/public ./public
COPY --from=build /usr/src/app/next.config.js /usr/src/app/package.json /usr/src/app/ssl-server.json ./
COPY --from=build --chown=nextjs:nodejs /usr/src/app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /usr/src/app/.next/static ./.next/static
EXPOSE 80 443
CMD ["node", "ssl-server.js"]
# CMD ["node", "server.js"]

