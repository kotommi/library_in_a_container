FROM node:16-bookworm-slim

RUN apt-get update && apt-get install -y --no-install-recommends dumb-init

ENV NODE_ENV production

COPY --chown=node:node . .

RUN npm ci --only=production

USER node

CMD ["dumb-init", "node", "index.js"]