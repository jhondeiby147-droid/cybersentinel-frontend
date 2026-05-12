# CyberSentinel AI - Frontend 🛡️

## Descripción
CyberSentinel AI es un sistema avanzado de análisis de vulnerabilidades de seguridad enfocado en la privacidad y ejecución offline. Este repositorio contiene el código fuente del Frontend, desarrollado en **Angular**, que proporciona la interfaz de usuario para interactuar con el motor de Deep Learning del backend.

## Tecnologías Principales
- **Framework:** Angular
- **Estilos:** TailwindCSS (Diseño Dark/Cyberpunk, paneles con efecto Glassmorphism)
- **Exportación de datos:** SheetJS (xlsx) para la generación de reportes

## Roles de Usuario
- **Analista de Seguridad:** Carga datos, ejecuta análisis y revisa resultados técnicos (scores de confianza y entidades NER).
- **Gerente de TI:** Consume los dashboards interactivos y resúmenes ejecutivos no técnicos.
- **Administrador del Sistema:** Gestiona usuarios, roles y revisa los logs del módulo de auditoría.

## Funcionalidades Clave
- **Gestión de Autenticación:** Componente de login y protección de rutas mediante `authGuard`.
- **Scanner de Vulnerabilidades:** Área optimizada con un textarea validado para procesar descripciones y logs crudos sin romper el diseño de la interfaz.
- **Dashboard Interactivo:** Visualización gráfica de la severidad (Baja, Media, Alta o Crítica), la confianza del modelo y las entidades detectadas, implementando estilos condicionales (ej. `bg-sev-critical`).
- **Módulo de Auditoría:** Componente interactivo (`audit.ts`) con tabla de registro histórico inmutable y paginación del lado del cliente.
- **Exportación de Reportes:** Función de parseo que aplana el JSON de entidades y exporta tanto reportes individuales como globales en formato excel descargable.
- **Gestión de Usuarios:** Formularios inteligentes en `users.ts` que cambian dinámicamente entre los modos de creación y edición.

## Requisitos Previos
- Node.js (v16 o superior recomendado)
- Angular CLI (`npm install -g @angular/cli`)

## Instalación y Ejecución
1. Clonar el repositorio.
2. Instalar dependencias mediante: `npm install`
3. Iniciar el servidor de desarrollo: `ng serve`
4. Navegar a `http://localhost:4200/` en tu navegador.

## Arquitectura y Rendimiento
El frontend está estrictamente desacoplado del backend (FastAPI) para integrarse sin problemas en infraestructuras de microservicios. Además, sigue el principio de delegar procesos de presentación al navegador cliente (como la paginación de tablas y construcción de archivos `.xlsx`), con el fin de liberar recursos del servidor y optimizar el rendimiento.