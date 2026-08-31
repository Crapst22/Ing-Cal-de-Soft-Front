# Distribuidora BV - Sistema de Gestión

Sistema de gestión integral para una distribuidora, desarrollado con **NestJS** (backend) y **React + Vite** (frontend).

## Actividad 4.1 - Despliegue del sistema

En esta actividad se realizó la configuración y el despliegue del sistema para poder utilizarlo desde internet.

Los pasos realizados fueron:

- Clonar repositorio
- Configurar entorno
- Ejecutar el sistema
- Desplegar en hosting (Vercel + Railway)

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Backend | NestJS 11, TypeScript 5.7 |
| Base de datos | MySQL 8.0 + TypeORM 0.3.22 |
| Autenticación | JWT + bcrypt + Google OAuth |
| Frontend | React 19, Vite 6, Tailwind CSS |
| Contenedores | Docker + Docker Compose |
| Hosting | Railway (backend), Vercel (frontend) |

---

## 1. Repositorios de GitHub

Los proyectos están divididos en dos repositorios de GitHub: uno para el frontend y otro para el backend. Esto permite trabajar y desplegar cada parte del sistema de forma independiente.

```bash
# Backend
git clone https://github.com/Crapst22/Prog-Avanzada-Back.git

# Frontend
git clone https://github.com/Crapst22/Prog-Avanzada-Front.git
```
---

## 2. Configuración de la base de datos

Para el desarrollo local se utiliza **Docker** para levantar una instancia de MySQL 8.0, junto con phpMyAdmin para la gestión visual de la base de datos.

```bash
cd Prog-Avanzada-Back
docker-compose up -d
```

| Servicio | URL |
|---|---|
| MySQL | `localhost:3310` |
| phpMyAdmin | http://localhost:8081 |

> El contenedor de MySQL crea automáticamente la base de datos `proyecto` con usuario `admin` / `admin` (ver `docker-compose.yml`).

Una vez levantada la base de datos, se crean las tablas ejecutando las migraciones de TypeORM:

```bash
yarn migration:run
```

Los datos iniciales se cargan mediante los seeds, ejecutando el endpoint:

```text
GET http://localhost:3000/api/seed-all/execute
```

Los seeds se ejecutan en orden y crean:

1. **Roles y usuarios** — Roles del sistema (Administrador, Vendedor, Repositor, etc.) y un usuario admin por defecto (`admin@gmail.com` / `admin`).
2. **Organización** — Provincias, localidades, condiciones de IVA, empresas, clientes, proveedores y personal.
3. **Familia de productos** — Líneas (Aceites, Azúcar, Chocolates, etc.) y marcas (SIN MARCA, CAROYENSE, CIRCE).

Los seeds son idempotentes: verifican si los datos ya existen antes de insertarlos.

> **Nota:** En el backend la propiedad `synchronize` está en `false` y el esquema se gestiona mediante migraciones (`orm.config.ts`). Para el autocompletado de tablas durante la configuración inicial, se podía activar, pero lo recomendable es trabajar siempre mediante migraciones.

---

## 3. Configuración del Backend en Railway

Una vez preparada la base de datos, se utilizó **Railway** para desplegar el backend.

Pasos realizados:

1. Se conectó Railway con el repositorio de GitHub del backend.
2. Se configuraron las variables de entorno necesarias para la conexión con la base de datos y el funcionamiento del servidor.
3. Railway detecta automáticamente la configuración del proyecto mediante el archivo `railway.json`:
   - **Builder**: `DOCKERFILE` (usa el `Dockerfile` del proyecto, Node.js 20 + Yarn).
   - **Comando de inicio**: `node dist/src/main.js`.
   - **Healthcheck**: `/api`.
4. Railway genera un dominio automático, por ejemplo: `https://tu-proyecto.up.railway.app`.

Las variables de entorno configuradas incluyen la conexión a la base de datos, el JWT, la expiración de tokens y el Client ID de Google.

> Los valores reales de las variables de entorno no se incluyen en el repositorio, ya que contienen información sensible (ver archivo `.env.production` con valores de ejemplo/placeholder).

---

## 4. Configuración de autenticación con Google

Para permitir que los usuarios se autentiquen con una cuenta de Google, se configuró **Google Cloud**:

1. Se creó un proyecto dentro de Google Cloud.
2. Se configuraron las credenciales de Google OAuth.
3. Se agregó el dominio correspondiente al proyecto.
4. Se obtuvo el `GOOGLE_CLIENT_ID` y se agregó como variable de entorno en Railway.

```env
GOOGLE_CLIENT_ID=<ID-proporcionado-por-Google>
```

De esta manera, el backend desplegado en Railway puede utilizar el Client ID para autenticar usuarios mediante Google.

---

## 5. Configuración del Frontend en Vercel

Para desplegar el frontend se utilizó **Vercel**:

1. Se conectó Vercel con el repositorio de GitHub del frontend.
2. Se configuró el proyecto:
   - Framework Preset: **Vite**
   - Build command: `yarn build`
   - Output directory: `dist`
3. El archivo `vercel.json` incluye rewrites para que React Router funcione correctamente (toda ruta cae en `index.html`).
4. Se agregó la variable de entorno `VITE_API_URL` con la URL real del backend en Railway.
5. Vercel genera un dominio automático, por ejemplo: `https://tu-proyecto.vercel.app`.

| Servicio | URL |
|---|---|
| Frontend (Vercel) | `https://<front>.vercel.app` |
| Backend / API (Railway) | `https://<back>.up.railway.app/api` |

---

## 6. Variables de entorno

Las variables de entorno son necesarias para conectar las diferentes partes del proyecto y evitar colocar información sensible directamente dentro del código.

### Backend

```env
DB_HOST=localhost
DB_PORT=3310
DB_USERNAME=admin
DB_PASSWORD=admin
DB_DATABASE=proyecto

PORT=3000
DB_TYPE=mysql
DB_SSL=false
JWT_SECRET=<secret>
JWT_EXPIRATION_ACCESS=60s
JWT_EXPIRATION_REFRESH=7d
PUNTO_VENTA_ACTIVO_ID=2
GOOGLE_CLIENT_ID=<google_client_id>
```

En el backend se configuraron las variables relacionadas con:

- Conexión con la base de datos.
- Configuración del servidor.
- Autenticación JWT.
- Google OAuth.

> En producción (`.env.production`) se debe apuntar a la base de datos alojada y activar `DB_SSL=true` cuando corresponda.

### Frontend

- `.env.development` → `VITE_API_URL="http://localhost:3000/api"`
- `.env.production` → `VITE_API_URL="https://<backend>.up.railway.app/api"`

> **Importante:** Los valores reales de estas variables no deben subirse a GitHub. En `.env.production` la URL del backend debe apuntar al dominio real de Railway.

---

## 7. Ejecución del proyecto

### Requisitos previos

- Node.js 20 o superior
- Yarn (`npm install -g yarn`)
- Docker y Docker Compose (para la base de datos local)
- Git

### Backend

```bash
cd Prog-Avanzada-Back/proyecto
yarn install
yarn migration:run   # Ejecuta las migraciones de base de datos
yarn start:dev       # Inicia con hot-reload
```

La API queda disponible en **http://localhost:3000** y su documentación Swagger en **http://localhost:3000/api**.

### Frontend

```bash
cd Prog-Avanzada-Front
yarn install
yarn dev
```

La aplicación queda disponible en **http://localhost:5173**.

---

## 8. Pruebas básicas

### Backend

1. Verificar que la API responde: `GET http://localhost:3000/api` → debe devolver `200 OK`.
2. Acceder a Swagger y probar un endpoint de autenticación: `POST /api/auth/login`.
3. Probar un CRUD básico (ej. listar clientes o productos) y confirmar que devuelve datos de la base de datos.

### Frontend

1. Abrir la URL del frontend y validar que carga correctamente.
2. Iniciar sesión con credenciales del sistema.
3. Navegar por los módulos principales (clientes, productos, facturas) y verificar que la información se carga desde la API.
4. Probar crear/editar un registro y confirmar que persiste al recargar la página.

### Consideraciones

- Usar navegadores actualizados y `Ctrl+Shift+R` (recarga forzada) si hay cambios de assets.
- Si se modifica el backend, Railway redepliega automáticamente con cada push a GitHub.

---

## 9. Despliegue automático

Al conectar los repositorios con GitHub, tanto Railway como Vercel detectan los nuevos cambios y reinician el proceso de despliegue automáticamente.

Cuando se hacen cambios y se ejecuta `push` al repositorio:

- **Railway** vuelve a compilar y desplegar el backend.
- **Vercel** vuelve a generar el build y publicar el frontend.

Esto facilita el mantenimiento del proyecto porque no es necesario realizar manualmente el proceso de despliegue cada vez que se actualiza el código.

---

## 10. Scripts utilizados

### Backend

```bash
yarn install              # Instalar dependencias
yarn start                # Iniciar en modo normal
yarn start:dev            # Iniciar con hot-reload
yarn build                # Compilar TypeScript
yarn start:prod           # Ejecutar la compilación
yarn lint                 # Lint y formato
```

### Frontend

```bash
yarn install              # Instalar dependencias
yarn build                # Build de producción
yarn lint                 # Lint
```

---

## 11. Servicios utilizados

| Servicio | Uso dentro del proyecto |
|---|---|
| GitHub | Guardar el código y controlar las versiones |
| Docker | Base de datos local (MySQL + phpMyAdmin) |
| Railway | Alojar y ejecutar el backend |
| Vercel | Alojar y ejecutar el frontend |
| Google Cloud | Configurar la autenticación con Google |

---

## 12. Estructura del proyecto

```
Proyecto1_Back/
└── proyecto/                  # Raíz del backend (NestJS)
    ├── src/
    │   ├── main.ts            # Bootstrap de la aplicación
    │   ├── app.module.ts      # Módulo raíz
    │   ├── index.ts           # Exportación central de entidades
    │   ├── migrations/        # Migraciones de base de datos
    │   └── modules/
    │       ├── gestion-usuario/    # Usuarios, autenticación, roles
    │       ├── gestion-productos/  # Catálogo, stock, precios
    │       ├── gestion-documentos/ # Facturas, pedidos, remitos
    │       ├── gestion-sistema/    # Configuración, auditoría
    │       ├── organizacion/       # Clientes, proveedores, personal
    │       ├── gutil/              # Provincias, localidades, IVA, domicilios
    │       └── common/             # Filtros, pipes, decoradores, seeds
    ├── docker-compose.yml     # MySQL + phpMyAdmin
    ├── railway.json           # Configuración de Railway
    ├── Dockerfile             # Imagen de producción
    ├── orm.config.ts          # Configuración TypeORM CLI
    └── .env / .env.production # Variables de entorno

Proyecto1_Front/
├── src/                       # Código de la aplicación React
├── .env.development           # Variables de desarrollo
├── .env.production            # Variables de producción
├── vercel.json                # Rewrites para SPA
└── vite.config.ts             # Configuración de Vite
```

---

## 13. Consideraciones

- El frontend y el backend se encuentran en repositorios separados.
- El código del backend se encuentra dentro de la carpeta `proyecto/` al clonar el repositorio.
- La base de datos se ejecuta en TiDB y en producción mediante el servicio de Railway.
- El backend se encuentra desplegado en Railway usando el `Dockerfile` (builder `DOCKERFILE` de `railway.json`).
- El frontend se encuentra desplegado en Vercel.
- La conexión entre el backend y la base de datos se realiza mediante variables de entorno.
- La autenticación con Google utiliza un Client ID generado desde Google Cloud.
- Las variables de entorno y credenciales no deben subirse al repositorio de GitHub (ver `.gitignore`).

