FROM node:22

WORKDIR /backend
COPY package.json .
RUN export NODE_OPTIONS=--openssl-legacy-provider && npm install
COPY . .
ARG CLIENT_ORIGIN
ENV CLIENT_ORIGIN=$CLIENT_ORIGIN
CMD export NODE_OPTIONS=--openssl-legacy-provider && npm start
