FROM node:18-alpine

WORKDIR /react-frontend/

COPY package.json /react-frontend/
COPY pages/ /react-frontend/pages
COPY components/ components/react-frontend/components
COPY assets/ /react-frontend/assets
COPY styles/ /react-frontend/styles

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "dev"]
