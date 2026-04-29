# Proyecto Pdisc (HTML + JS)

Proyecto web estatico con autenticacion en Supabase.

## Estructura

- `pages/`: vistas (`login`, `register`, `perfil`)
- `js/`: logica de autenticacion y configuracion Supabase
- `Assets/`: estilos y recursos visuales
- `db/schema/`: scripts SQL para schema base en Supabase
- `docs/`: guia de ejecucion local y roadmap

## Ejecutar local

1. `npm install`
2. `npm run dev`
3. Abrir `http://localhost:5173` (o el puerto alternativo que muestre `serve`)

## Flujo de autenticacion

- Login por email/contrasena y Google: `pages/login.html`
- Registro por email/contrasena y Google: `pages/register.html`
- Perfil y cierre de sesion: `pages/perfil.html`
