FROM node:16.15.1
WORKDIR /backend
COPY . .
RUN npm install
EXPOSE 5000
CMD ["npm","start"]
