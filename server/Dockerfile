FROM node:18-alpine

WORKDIR /express-backend/

COPY package.json /express-backend/
COPY game_utils.js /express-backend/
COPY package.json /express-backend/

RUN npm install

EXPOSE 4000

CMD ["npm", "run", "start"]