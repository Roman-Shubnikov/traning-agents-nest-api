FROM node:16-alpine
WORKDIR /app
COPY package.json yarn.lock ./
RUN ls
RUN yarn install
COPY . .
RUN yarn build
EXPOSE 3003
CMD [ "node", "dist/src/main" ]
