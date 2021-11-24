FROM node:12.20.2-alpine as node

WORKDIR /usr/src/app

ADD package.json ./package.json

RUN npm install

COPY . .

RUN npm run build --prod

EXPOSE 4203
EXPOSE 49153

ENTRYPOINT ["/bin/sh", "-c", "npm start"]

FROM cicnl/nginx:1.13.10-alpine

COPY --from=node /usr/src/app/dist/cpo-dashboard /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

CMD ["nginx", "-g", "daemon off;"]