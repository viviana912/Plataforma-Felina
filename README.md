# Plataforma Felina — Refugio del Sol

Plataforma web para la gestión integral de asociaciones felinas. Backend en Spring Boot, frontend en Angular y base de datos PostgreSQL, orquestados con Docker Compose para desarrollo y demostración en local.

## Requisitos

- **Docker Desktop** instalado y corriendo (Windows / macOS / Linux).
- Puertos libres en la máquina: `4200`, `8080` y `5432`.

## Ejecutar la aplicación

Desde la raíz del proyecto:

```bash
docker compose up --build -d
```

Esto levanta tres contenedores:

| Servicio | Contenedor | Puerto | Descripción |
|---|---|---|---|
| `postgres-db` | `plataforma-felina-db` | 5432 | Base de datos PostgreSQL 18 |
| `backend` | `plataforma-felina-backend` | 8080 | API REST Spring Boot |
| `frontend` | `plataforma-felina-frontend` | 4200 | Aplicación Angular sobre nginx |

Cuando los tres estén arriba, accede a:

- **Aplicación**: <http://localhost:4200>
- **API**: <http://localhost:8080>

Hibernate crea automáticamente las tablas en el primer arranque y un *seeder* inserta los roles `USER` y `ADMIN`.

## Variables de entorno opcionales

El `docker-compose.yml` arranca con valores por defecto. Algunos servicios externos requieren credenciales propias:

| Variable | Para qué | Si no se define |
|---|---|---|
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Subida de fotos de gatos, avatares y diario | La subida de imágenes no estará disponible |
| `GEMINI_API_KEY` | Asistente conversacional Bigotín | Bigotín responde con un mensaje de "no disponible" |
| `JWT_SECRET` | Firma de los tokens JWT | Se usa un valor por defecto válido para desarrollo (cámbialo en producción) |

Para definirlas, crea un archivo `.env` en la raíz del proyecto:

```env
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
GEMINI_API_KEY=tu_gemini_key
JWT_SECRET=una-clave-larga-y-secreta-de-al-menos-32-caracteres
```

Docker Compose carga el `.env` automáticamente al arrancar.

## Comandos habituales

### Parar (sin borrar datos)

```bash
docker compose stop
```

### Reanudar

```bash
docker compose up -d
```

### Ver logs

```bash
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f postgres-db
```

### Reconstruir tras cambios en el código

**Frontend:**

```bash
docker compose build --no-cache frontend
docker compose up -d frontend
```

**Backend** (requiere generar el `.jar` antes):

```bash
cd plataforma-felina-backend
mvn clean package -DskipTests
cd ..
docker compose build --no-cache backend
docker compose up -d backend
```

**Todo a la vez:**

```bash
docker compose up --build -d
```

> **Windows PowerShell**: el operador `&&` no está disponible. Ejecuta cada comando en una línea separada, o únelos con `;` (que ejecuta el segundo aunque el primero falle).

### Borrar contenedores y/o datos

| Comando | Efecto |
|---|---|
| `docker compose stop` | Para los contenedores. **Mantiene** datos. |
| `docker compose down` | Borra contenedores. **Mantiene** datos (volumen). |
| `docker compose down -v` | Borra contenedores **y** la base de datos. |

## Inspeccionar la base de datos

```bash
# Listar tablas
docker exec plataforma-felina-db psql -U postgres -d plataforma_felina -c "\dt"

# Ver estructura de una tabla
docker exec plataforma-felina-db psql -U postgres -d plataforma_felina -c "\d usuario"

# Consultar datos
docker exec plataforma-felina-db psql -U postgres -d plataforma_felina -c "SELECT id, email, id_rol FROM usuario;"

# Shell interactiva (escribe \q para salir)
docker exec -it plataforma-felina-db psql -U postgres -d plataforma_felina
```

## Troubleshooting — qué hacer si no arranca

### "El puerto X está en uso"

Otro proceso ocupa 4200, 8080 o 5432. Localízalo y ciérralo, o cambia el puerto en `docker-compose.yml` (lado izquierdo del `:` en la sección `ports`).

```bash
# Windows (PowerShell o CMD)
netstat -ano | findstr :8080

# macOS / Linux
lsof -i :8080
```

### El backend no termina de arrancar

Suele ser porque PostgreSQL aún no está listo. El compose tiene un `healthcheck` que espera a la BD, pero si tarda:

```bash
docker compose logs backend
```

Si ves errores de conexión, espera unos segundos y reinicia solo el backend:

```bash
docker compose restart backend
```

### Errores de CORS en el navegador

La variable `CORS_ALLOWED_ORIGINS` del backend no incluye la URL desde la que estás accediendo. Si entras desde una URL distinta de `http://localhost:4200`, edítala en `docker-compose.yml`.

### "Database does not exist" o "role postgres does not exist"

El volumen `postgres_data` se ha corrompido. Borra el volumen y vuelve a arrancar:

```bash
docker compose down -v
docker compose up --build -d
```

### El frontend muestra una página en blanco

Comprueba los logs del contenedor:

```bash
docker compose logs frontend
```

Si hay errores de compilación, corrige el código y reconstruye:

```bash
docker compose build --no-cache frontend
docker compose up -d frontend
```

### Hibernate no crea las tablas

Verifica que el backend ha conectado a la BD:

```bash
docker compose logs backend | grep -i "hibernate\|hikari"
```

Si las tablas siguen sin crearse, fuerza un arranque limpio:

```bash
docker compose down -v
docker compose up --build -d
```

### Reset completo (último recurso)

```bash
docker compose down -v
docker system prune -a --volumes
docker compose up --build -d
```

> ⚠️ `docker system prune -a --volumes` borra **todas** las imágenes y volúmenes de Docker de tu máquina, no solo los del proyecto. Úsalo solo si estás seguro.

## Estructura del proyecto

```
.
├── docker-compose.yml              # Orquestación de los tres servicios
├── plataforma-felina-backend/      # Spring Boot 3 · Java 21 · JPA
│   └── Dockerfile
└── plataforma-felina-frontend/     # Angular 21 · SSR · nginx
    └── Dockerfile
```
