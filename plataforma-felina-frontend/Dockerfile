# Build Angular
FROM node:20 as build

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Servir con nginx
FROM nginx:alpine

# 👇 AÑADE ESTO
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 👇 ya lo tenías
COPY --from=build /app/dist/plataforma-felina-frontend/browser /usr/share/nginx/html

EXPOSE 80
