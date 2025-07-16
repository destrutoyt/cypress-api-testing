FROM cypress/base

RUN mkdir /app
WORKDIR /app

COPY . /app

RUN npm install

RUN [ "npx", "cypress", "run"]