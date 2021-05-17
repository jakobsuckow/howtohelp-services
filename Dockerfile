FROM node:12.16.2-alpine

ENV NODE_ENV development

WORKDIR /app

COPY package*.json /app/
COPY tsconfig.json /app/

RUN yarn

COPY . .

RUN yarn run build

VOLUME /app

CMD [ "yarn", "start" ]
