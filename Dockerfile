FROM node:20-alpine

WORKDIR /app

COPY package.json ./
RUN npm install --legacy-peer-deps --no-audit --no-fund || (cat /root/.npm/_logs/*-debug-0.log && exit 1)

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
