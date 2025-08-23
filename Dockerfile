FROM node:22.12.0

WORKDIR /app

RUN npm install -g corepack

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

EXPOSE 5173

CMD ["yarn", "dev"]
