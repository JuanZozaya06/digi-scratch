# AGENTS

## Estructura

- La aplicacion Angular vive dentro de `frontend/`.
- El repo raiz puede contener documentacion y archivos de soporte.

## Desarrollo

- Usa Angular con `NgModules`, no standalone components.
- Mantener toda la data en mocks locales o `localStorage`.
- Evitar dependencias externas innecesarias.

## Ejecucion

- Instalar dependencias dentro de `frontend/` con `npm install`.
- Validar cambios con `npm run build`.
- No levantar `ng serve` ni `npm start` para validar; el build es suficiente.
