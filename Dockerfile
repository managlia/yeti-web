FROM node:9.6.1-alpine
RUN apk add --update git && rm -rf /var/cache/apk/*
RUN mkdir -p /usr/src/app
RUN apk --no-cache add bash
WORKDIR /usr/src/app
COPY package.json /usr/src/app
RUN npm cache clean --force
RUN npm rebuild node-sass --force
RUN npm install
#COPY . /usr/src/app
VOLUME .:/usr/src/app
EXPOSE 4200
CMD ["npm", "start"]
