# Plataforma Felina

## Requisitos

- Docker Desktop instalado y corriendo

## Ejecutar la aplicacion

```bash
docker compose up -d
```

Esto levanta 3 contenedores:
- **mysql-db** → Base de datos en puerto 3306
- **backend-app** → API Spring Boot en puerto 8080
- **frontend-app** → Angular (Nginx) en puerto 4200

Accede a: http://localhost:4200

## Importar la base de datos (primera vez o tras perder datos)

```bash
docker exec -i mysql-db mysql -uroot -p12345678 plataforma_felina < "C:\Users\Viviana\OneDrive\Documentos\dumps\Dump.sql"
```

## Cuando haces cambios en el codigo

### Solo frontend:
```bash
docker compose build --no-cache frontend && docker compose up -d frontend
```

### Solo backend:
Primero genera el .jar (desde la carpeta del backend):
```bash
cd plataforma-felina-backend
mvn clean package -DskipTests
cd ..
docker compose build --no-cache backend && docker compose up -d backend
```

### Todo junto:
```bash
docker compose up --build -d
```

## Parar la aplicacion

```bash
docker compose stop
```
Esto para los contenedores SIN borrar datos. Puedes volver a arrancar con `docker compose up -d`.

## CUIDADO - Comandos que borran datos

| Comando | Efecto |
|---------|--------|
| `docker compose down` | Borra contenedores pero MANTIENE la base de datos (volume) |
| `docker compose down -v` | BORRA TODO incluida la base de datos |

Si ejecutaste `docker compose down -v`, necesitas volver a importar el dump.

## Ver logs

```bash
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f mysql-db
```
