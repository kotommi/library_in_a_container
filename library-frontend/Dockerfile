FROM node:16-bookworm-slim as build

WORKDIR /usr/src/app

COPY . .

RUN npm ci --only=production

CMD ["npm", "run", "build"]

FROM nginx:1.25.1-bookworm

COPY --from=build /usr/src/app/build /usr/share/nginx/html