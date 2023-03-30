FROM node:16-alpine
WORKDIR /app
COPY package.json yarn.lock ./
RUN ls
RUN yarn install
COPY . .
RUN yarn build
EXPOSE 3003
RUN yarn start:prod
