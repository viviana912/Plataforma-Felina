# Build Angular
FROM node:20 AS build

# Configuracion de build de Angular (production por defecto, development para
# arrancar con docker-compose en local apuntando al backend del propio compose).
ARG BUILD_CONFIG=production

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build -- --configuration ${BUILD_CONFIG}

# Servir con nginx
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/plataforma-felina-frontend/browser /usr/share/nginx/html

EXPOSE 80
