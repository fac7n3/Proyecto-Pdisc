# Run local (HTML/JS)

## 1) Requisitos

- Node.js 20+
- Proyecto de Supabase creado
- Google OAuth habilitado en Supabase Auth

## 2) Instalar y correr

1. `npm install`
2. `npm run dev`
3. Abrir `http://localhost:5173` (si ese puerto esta ocupado, `serve` usa otro)

## 3) Paginas principales

- `pages/login.html` -> inicio de sesion con email/contrasena y Google
- `pages/register.html` -> crear cuenta con email/contrasena y Google
- `pages/perfil.html` -> sesion activa y cierre de sesion

## 4) Configurar login con Google

En Supabase Dashboard:

- Auth -> Providers -> Google -> Enable
- Configurar Client ID / Secret de Google
- Callback de Supabase:
  - `https://<your-project-ref>.supabase.co/auth/v1/callback`

En Google Cloud Console:

- Agregar ese callback en Authorized redirect URIs
- Agregar `http://localhost:5173` en Authorized JavaScript origins

## 5) SQL base

- Ejecutar `db/schema/01_auth_profiles.sql` en Supabase SQL Editor
