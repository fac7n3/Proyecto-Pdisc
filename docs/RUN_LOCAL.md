# Run local (MVP)

## 1) Requisitos

- Node.js 20+
- Proyecto de Supabase creado
- Google OAuth habilitado en Supabase Auth

## 2) Variables de entorno

1. Copiar `.env.example` a `.env.local`
2. Completar:
   - `PUBLIC_SUPABASE_URL`
   - `PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (solo backend, nunca cliente)
   - `PUBLIC_APP_URL` (por defecto `http://localhost:5173`)

## 3) Base de datos inicial

1. Abrir Supabase SQL Editor
2. Ejecutar `supabase/schema/01_auth_profiles.sql`
3. Verificar tabla `public.profiles` y políticas RLS creadas
4. Verificar tabla `public.products` y políticas RLS para vendedor

## 4) Configurar login con Google

En Supabase Dashboard:

- Auth -> Providers -> Google -> Enable
- Configurar Client ID / Secret de Google
- URL de callback típica:
  - `https://<your-project-ref>.supabase.co/auth/v1/callback`

En la app local:

- El flujo OAuth vuelve a `http://localhost:5173/auth/callback`
- Esa ruta intercambia el `code` por sesion y redirige a `/perfil`

En Google Cloud Console:

- Agregar el callback anterior en Authorized redirect URIs
- Agregar `http://localhost:5173` en Authorized JavaScript origins

## 5) Criterio de terminado de esta etapa

- La app corre en local
- El usuario puede iniciar sesión con Google
- Existe una fila en `public.profiles` luego del registro/login
- El usuario autenticado solo puede leer/editar su perfil (RLS)

## 6) Probar modulo vendedor (minimo)

1. Convertir tu usuario a vendedor desde SQL Editor:

```sql
update public.profiles
set role = 'vendedor'
where email = 'tu-email@ejemplo.com';
```

2. Iniciar sesion y entrar a `/vendedor/productos`
3. Crear un producto desde el formulario
