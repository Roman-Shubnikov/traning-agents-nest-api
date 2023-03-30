FROM node:16-alpine
WORKDIR /
RUN ls
RUN yarn install
RUN yarn build
EXPOSE 3003
CMD [ "node", "dist/main.js" ]
