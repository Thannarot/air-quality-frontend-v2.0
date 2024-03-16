FROM node:21-alpine AS build
WORKDIR /app
COPY . . 
RUN npm install
RUN npm run build

FROM nginx:1.18-alpine AS deploy-static

WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=build /app/build .
ENTRYPOINT ["nginx", "-g", "daemon off;"]


FROM node:21-alpine AS deploy-node

WORKDIR /app
RUN rm -rf ./* 
COPY --from=build /app/package.json .
COPY --from=build /app/build .
# RUN npm install
# RUN npm run build
CMD ["node", "index.js"]
