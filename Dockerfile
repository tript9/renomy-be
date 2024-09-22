FROM node:22

WORKDIR /backend
COPY package.json .
RUN export NODE_OPTIONS=--openssl-legacy-provider && npm install
COPY . .
CMD export NODE_OPTIONS=--openssl-legacy-provider && npm start
