FROM node:16.13-alpine

WORKDIR /app
COPY ./package.json ./
RUN npm i --production
COPY . .
CMD ["npm", "run", "start:prod"]
