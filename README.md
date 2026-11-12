## BairesGuessr
```markdown
BairesGuessr/
├── backend/                  # API REST en Kotlin + Spring Boot
│   ├── src/
│   │   ├── main/
│   │   │   ├── kotlin/com/bairesguessr/
│   │   │   │   ├── controller/   # Endpoints REST (Auth, Partidas, etc.)
│   │   │   │   ├── domain/       # Entidades (Usuario, Partida, etc.)
│   │   │   │   ├── repository/   # Repositorios y MongoDB
│   │   │   │   └── service/      # Lógica de negocio
│   │   │   └── resources/        # Configuración (application.yml)
│   │   └── test/
│   └── build.gradle.kts
│
├── database/                 # Persistencia, esquemas y datos iniciales (Docker)
│   ├── data/                 # Volumen local para PostgreSQL
│   ├── .mongo/               # Volumen local para MongoDB
│   ├── scripts_nosql/        # Dataset GeoJSON y carga inicial para MongoDB
│   │   ├── espacios_culturales.json
│   │   ├── espacios-culturales-limpio.csv
│   │   ├── import_mongo.py
│   │   └── init-mongo.js
│   └── script.sql            # Creación de tablas e integridad referencial (PostgreSQL)
│
├── documentacion/            # Entregables del TP
│   ├── informe.pdf           # Informe final del proyecto
│   └── DER                   # Diagrama Entidad-Relación
│
├── frontend/                 # Aplicación  (React + TypeScript + Chakra UI v3)
│   ├── public/
│   ├── src/
│   │   ├── components/       # Visor MapillaryJS, mapa Leaflet y componentes UI
│   │   ├── domain/           # Tipos e interfaces (user.ts, etc.)
│   │   ├── pages/            # Vistas principales (Login, Register, Menu, Partida)
│   │   ├── services/         # Llamadas API con Axios
│   │   ├── App.tsx           # Router principal y layout base
│   │   ├── main.tsx          # Punto de entrada con Chakra Provider
│   │   └── routes.tsx        # Definición de rutas
│   ├── .env                  # Variables de entorno (VITE_MAPILLARY_TOKEN)
│   ├── biome.json            # Configuración de linter y formateador
│   ├── index.html
│   ├── package.json          # Dependencias, importante hacer PNPM INSTALL
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── .gitignore                # Control de versiones global
├── docker-compose.yml        # Orquestación de contenedores PostgreSQL y MongoDB
└── README.md

```
<img width="1849" height="1077" alt="image" src="https://github.com/user-attachments/assets/410edc5f-9ce1-446a-89ec-b558241ab433" />

<img width="1848" height="1068" alt="image" src="https://github.com/user-attachments/assets/b0e1ad47-7da5-464e-a23d-556d0ed74904" />


## Instrucciones para ejecutar el proyecto

1. **Clonar el repositorio:**
```bash
git clone https://github.com/LeanSChavez/BairesGuessr.git
cd BairesGuessr

```


2. **Crear el archivo `.env` dentro de `/frontend`:**
```env
VITE_MAPILLARY_TOKEN=MLY|(tu_token)

```


3. **Levantar las bases de datos (PostgreSQL y MongoDB):**
```bash
docker compose up -d

```


4. **Levantar el Backend:**
Ejecutar `BairesGuessrApplication.kt` en `/backend` desde IntelliJ IDEA / VS Code (o correr `./gradlew bootRun` dentro de `/backend`).
5. **Levantar el Frontend:**
```bash
cd frontend
pnpm install
pnpm dev

```


Ingresar a `http://localhost:5173`, registrarse y comenzar a jugar.
