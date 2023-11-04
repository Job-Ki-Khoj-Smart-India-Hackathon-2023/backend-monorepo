FROM node:21

WORKDIR /app

COPY package.*json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

RUN echo pwd

CMD ["npm", "start"]
