FROM node:24.11.1-alpine3.22 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.28.0-alpine3.21-slim AS production
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist /usr/share/nginx/html/
ENV API_URL="http://backend/api/v1"
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]
