
# BairesGuessr

```text
BairesGuessr/
├── backend/                  # API REST en Kotlin + Spring Boot
│   ├── src/
│   │   ├── main/
│   │   │   ├── kotlin/com/bairesguessr/
│   │   │   │   ├── controller/   # Endpoints (Auth, Partidas, etc.)
│   │   │   │   ├── domain/       # Entidades JPA (Usuario, Partida, etc.)
│   │   │   │   ├── repository/   # Repositorios JPA y MongoDB
│   │   │   │   └── service/      # Lógica de negocio
│   │   │   └── resources/        # Configuración (application.yml, etc.)
│   │   └── test/
│   └── build.gradle.kts
│
├── database/                 # Persistencia y datos locales (Docker)
│   ├── data/                 # Volumen para PostgreSQL
│   └── .mongo/               # Volumen para MongoDB
│
├── documentación/            # Especificaciones, diagramas y consignas del TP
│
├── frontend/                 # Aplicación SPA (React + TypeScript + Chakra UI v3)
│   ├── public/
│   ├── src/
│   │   ├── components/       # Componentes reutilizables y snippets UI
│   │   ├── domain/           # Tipos e interfaces (user.ts, etc.)
│   │   ├── pages/            # Vistas principales (Login, Register, Menu)
│   │   ├── services/         # Llamadas API con Axios (userService.ts, etc.)
│   │   ├── App.tsx           # Router principal y layout base
│   │   ├── main.tsx          # Punto de entrada con Chakra Provider
│   │   └── routes.tsx        # Definición de rutas
│   ├── biome.json            # Configuración de linter y formateador
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── .gitignore                # Control de versiones global
├── pnpm-workspace.yaml       # Configuración de monorepo pnpm
└── README.md
