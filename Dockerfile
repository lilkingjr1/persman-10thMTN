FROM node:14-alpine

WORKDIR /app/

COPY . /app

RUN npm install --production

EXPOSE 8080

ENTRYPOINT  [ "node", "app.js" ]