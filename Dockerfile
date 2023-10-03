FROM node:20-alpine3.17

WORKDIR /usr/src/app
COPY package*.json ./

EXPOSE 3000

RUN npm install
# Copy the rest of the application files into the container
COPY . .
CMD npm start