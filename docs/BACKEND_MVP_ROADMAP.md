# Backend MVP roadmap (Baradero)

## Objetivo del MVP actual

Habilitar ejecución local para desarrolladores y registro seguro de usuarios (Google), dejando una base sólida para evolucionar a marketplace.

## Alcance de esta iteración
 Hacer este curso https://www.udemy.com/course/sql-de-cero/
- Auth con Google
- Sesión persistente
- Perfil de usuario (`public.profiles`) con rol inicial `cliente`
- RLS mínima para seguridad de datos

## Fuera de alcance (por ahora)

- Pagos reales
- Integraciones de envío/logística
- Notificaciones complejas
- Dominio en producción

## Plan por etapas

### Etapa 1: Fundaciones (1-2 días)

- Estandarizar `.env` y setup local para todo el equipo
- Crear SQL base de perfiles y roles
- Validar trigger de creación automática de perfil

### Etapa 2: Auth y sesión (1-2 días)

- Login/registro con Google en Supabase Auth
- Flujo de callback y persistencia de sesión
- Ruta protegida mínima (`/perfil` o `/dashboard`)

### Etapa 3: Seguridad (1 día)

- Confirmar RLS habilitado en tablas expuestas
- Verificar que `authenticated` solo accede a su propio perfil
- Revisar que no se use `service_role` en frontend

### Etapa 4: Preparación marketplace (2-3 días)

- Diseñar esquema inicial de `categories`, `products`, `orders`, `order_items`
- Definir contratos API iniciales para frontend (JSON estable)
- Dejar backlog para módulo vendedor y admin

## Definiciones de terminado del MVP

- Cualquier dev puede levantar el proyecto local con instrucciones claras
- Registro/login con Google funciona de punta a punta
- Se crea/actualiza `public.profiles` automáticamente
- RLS activa y validada para evitar exposición de datos de usuarios
