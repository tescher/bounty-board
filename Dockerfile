
FROM node:16.19.0-alpine
WORKDIR /bountyboard
RUN npm update -g npm 
COPY package.json .
COPY yarn.lock .
COPY packages/react-app/package.json ./packages/react-app/package.json
RUN yarn install

COPY . .

CMD ["yarn", "run", "dev"]

