FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY --chown=node:node . .
RUN npx prisma generate

ENV NODE_ENV=production
EXPOSE 4000

USER node
CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]
