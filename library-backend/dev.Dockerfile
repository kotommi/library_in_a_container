FROM node:16.20.1-bookworm

WORKDIR /usr/src/app

COPY --chown=node:node . .

RUN npm install

USER node

CMD ["npm", "run", "nodemon"]