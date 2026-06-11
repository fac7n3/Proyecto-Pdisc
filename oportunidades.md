# 🔒 Auditoría de Ciberseguridad y Oportunidades de Mejora

**Proyecto:** Baradero Local  
**Fecha:** 9 de junio de 2026  
**Alcance:** Evaluación integral del frontend, backend (Supabase), esquema SQL, autenticación, y código JavaScript.

---

## Índice

1. [🚨 Vulnerabilidades Críticas de Seguridad](#-vulnerabilidades-críticas-de-seguridad)
2. [⚠️ Fallas de Autenticación y Autorización](#️-fallas-de-autenticación-y-autorización)
3. [🛒 Integridad del Carrito y Datos del Cliente](#-integridad-del-carrito-y-datos-del-cliente)
4. [🌐 Headers de Seguridad y Dependencias CDN](#-headers-de-seguridad-y-dependencias-cdn)
5. [🏗️ Oportunidades de Mejora de Código y Arquitectura](#️-oportunidades-de-mejora-de-código-y-arquitectura)
6. [📱 Oportunidades de Mejora UX/UI](#-oportunidades-de-mejora-uxui)

---

## 🚨 Vulnerabilidades Críticas de Seguridad

### SEC-01 · Cross-Site Scripting (XSS) en el carrito via `innerHTML`

> [!CAUTION]
> **Severidad: CRÍTICA** — Un atacante puede ejecutar código JavaScript arbitrario en el navegador de cualquier usuario.

**Ubicación:** [carrito.js:92-117](file:///c:/Proyecto/Proyecto-Pdisc/js/carrito.js#L92-L117)

**Descripción del riesgo:**  
El carrito renderiza datos del `localStorage` usando `innerHTML` sin sanitización. Los datos del carrito provienen del DOM en [home.js](file:///c:/Proyecto/Proyecto-Pdisc/js/home.js) y [search.js](file:///c:/Proyecto/Proyecto-Pdisc/js/search.js), donde los valores `name`, `shop`, e `image` se extraen con `textContent` y `getAttribute('src')`. Sin embargo, dado que **cualquier script** puede escribir en `localStorage`, un atacante con acceso al dominio (por ejemplo, a través de otra vulnerabilidad XSS, una extensión maliciosa, o compartiendo una computadora pública) podría inyectar datos como:

```json
[{"id":"xss","name":"<img src=x onerror=alert(document.cookie)>","shop":"test","price":1,"qty":1,"image":"x"}]
```

Cuando `carrito.js` renderiza este objeto, la inyección se ejecuta:
```javascript
row.innerHTML = `
  <span class="cart-item__name">${item.name}</span>  // ← XSS aquí
  ...
  <img src="${item.image}" .../>  // ← XSS aquí también
`;
```

**Solución recomendada:**
```javascript
// Crear una función de escape
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Usar en el renderizado
`<span class="cart-item__name">${escapeHTML(item.name)}</span>`
```

O mejor aún, usar `document.createElement()` y `textContent` en lugar de `innerHTML`.

---

### SEC-02 · XSS en el sistema de notificaciones (Toast) via `innerHTML`

> [!CAUTION]
> **Severidad: ALTA** — Si algún dato de usuario llega a `showToast`, se puede ejecutar código malicioso.

**Ubicación:** [auth-utils.js:53](file:///c:/Proyecto/Proyecto-Pdisc/js/auth-utils.js#L53)

**Descripción del riesgo:**  
La función `showToast` utiliza `innerHTML` para renderizar el mensaje:
```javascript
toast.innerHTML = `${icon} <span>${message}</span>`;
```

La línea 109 de [auth-utils.js](file:///c:/Proyecto/Proyecto-Pdisc/js/auth-utils.js#L109) inyecta directamente la `errorDescription` decodificada de la URL como parte del mensaje de error:
```javascript
userMsg = `Error: ${decodedDesc}`;
```

Un atacante podría construir una URL como:
```
/pages/login.html?error=x&error_description=<img+src=x+onerror=alert(1)>
```

Al abrir esa URL, el código malicioso se ejecutará en el navegador de la víctima.

**Solución recomendada:**
- Usar `textContent` para el span del mensaje en lugar de `innerHTML`
- Crear el icono y el texto como nodos DOM separados

---

### SEC-03 · Credenciales de Supabase expuestas en `.env` rastreado

> [!WARNING]
> **Severidad: MEDIA** — La `anon key` de Supabase está en texto plano en el archivo `.env`.

**Ubicación:** [.env](file:///c:/Proyecto/Proyecto-Pdisc/.env)

**Descripción del riesgo:**  
Si bien la `anon key` de Supabase está diseñada para ser pública (es una clave de acceso público controlada por RLS), el archivo `.env` contiene la URL del proyecto en texto plano. Aunque el `.gitignore` incluye `.env`, cualquier desarrollador con acceso al repositorio local puede ver estos valores. Actualmente el `.env` contiene credenciales reales:

```
VITE_SUPABASE_URL="https://otzhdwuaffcplrveuadc.supabase.co"
VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1Ni..."
```

**Riesgos adicionales:**
- Si alguien forkea el repositorio o accede al `.env`, tendrá acceso directo a tu instancia de Supabase
- El JWT de la `anon key` revela el `ref` (identificador del proyecto): `otzhdwuaffcplrveuadc`

**Solución recomendada:**
- Verificar que el `.env` nunca fue comiteado a Git (✅ verificado — no lo fue)
- Rotar la `anon key` periódicamente desde el dashboard de Supabase
- Agregar `.env*` al `.gitignore` (actualmente solo tiene `.env` y `.env.local`)

---

## ⚠️ Fallas de Autenticación y Autorización

### AUTH-01 · El vendedor se registra sin verificación de identidad (sólo localStorage)

> [!WARNING]
> **Severidad: ALTA** — Cualquier persona puede hacerse vendedor sin validación alguna.

**Ubicación:** [vender.js:42-52](file:///c:/Proyecto/Proyecto-Pdisc/js/vender.js#L42-L52)

**Descripción del riesgo:**  
El flujo de registro de vendedor depende enteramente de `localStorage`:
```javascript
localStorage.setItem('is_seller', 'true');
localStorage.setItem('seller_shop_name', nameInput);
```

Esto significa:
1. **Cualquier usuario** puede abrir DevTools y ejecutar `localStorage.setItem('is_seller', 'true')` para saltear el registro
2. El estado de vendedor **no persiste en la base de datos**, se pierde al limpiar el localStorage
3. **No existe conexión** entre el vendedor de `vender.js` (localStorage) y el rol `vendedor` en Supabase (la tabla `profiles`)
4. No se requiere autenticación para acceder a la página de vendedor

**Solución recomendada:**
- Integrar el registro de vendedor con Supabase Auth y la tabla `profiles`
- Exigir autenticación antes de mostrar el formulario de vendedor
- Validar el rol del usuario en el servidor antes de permitir operaciones de vendedor

---

### AUTH-02 · El rol del usuario se determina desde el cliente durante el registro

> [!WARNING]
> **Severidad: MEDIA-ALTA** — Un usuario puede auto-asignarse el rol de vendedor manipulando la petición.

**Ubicación:** [register.js:104-113](file:///c:/Proyecto/Proyecto-Pdisc/js/register.js#L104-L113)

**Descripción del riesgo:**  
Durante el registro, el `account_type` se envía como `user_metadata`:
```javascript
const { data, error } = await supabase.auth.signUp({
  email, password,
  options: {
    data: {
      full_name: name,
      account_type: accountType,  // ← valor del cliente
    }
  }
});
```

El trigger `handle_new_user` en la base de datos ([01_auth_profiles.sql:162](file:///c:/Proyecto/Proyecto-Pdisc/db/schema/01_auth_profiles.sql#L162)) confía ciegamente en este valor:
```sql
v_role := (case lower(coalesce(new.raw_user_meta_data ->> 'account_type', 'cliente'))
    when 'vendedor' then 'vendedor'
    ...
```

Un atacante podría interceptar el request o usar la API directamente para registrarse con `account_type: 'vendedor'` sin pasar por la UI.

**Solución recomendada:**
- Registrar a todos como `cliente` por defecto
- Crear un flujo separado de "solicitud de cuenta vendedor" que requiera verificación manual o documental (CUIT/CUIL como se menciona en [Problematiccas proyecto.txt](file:///c:/Proyecto/Proyecto-Pdisc/Problematiccas%20proyecto.txt))
- Usar una función Edge de Supabase o un admin endpoint para promover un usuario a vendedor

---

### AUTH-03 · La página de perfil hace `getUser()` y luego consulta `profiles` sin filtro `eq('id', user.id)`

> [!IMPORTANT]
> **Severidad: MEDIA** — La query podría retornar datos de otro usuario dependiendo de las RLS policies.

**Ubicación:** [perfil.js:21-24](file:///c:/Proyecto/Proyecto-Pdisc/js/perfil.js#L21-L24)

**Descripción del riesgo:**  
La query en el perfil es:
```javascript
const profileResponse = await supabase
  .from("profiles")
  .select("id, email, full_name, role")
  .single();
```

No hay un `.eq('id', user.id)`. Depende enteramente de que la RLS policy `profiles_select_own` filtre correctamente. Si la RLS no estuviera habilitada o tuviera un error, esta query retornaría el primer perfil de la tabla.

**Solución recomendada:**
```javascript
const profileResponse = await supabase
  .from("profiles")
  .select("id, email, full_name, role")
  .eq('id', user.id)  // ← agregar filtro explícito
  .single();
```

---

### AUTH-04 · No se usa `getUser()` consistentemente — se mezcla con `getSession()`

> [!IMPORTANT]
> **Severidad: MEDIA** — `getSession()` lee el JWT del storage local sin verificación con el servidor, lo que podría permitir usar tokens expirados.

**Ubicación:** [auth-utils.js:135](file:///c:/Proyecto/Proyecto-Pdisc/js/auth-utils.js#L135)

**Descripción del riesgo:**  
El proyecto usa correctamente `supabase.auth.getUser()` en la verificación inicial (que hace una llamada al servidor), pero el `onAuthStateChange` podría dispararse con un token del `localStorage` que ya expiró o fue revocado.

**Solución recomendada:**
- Siempre verificar el estado del usuario con `getUser()` para operaciones sensibles
- No confiar en `session` del `onAuthStateChange` para decidir acceso a recursos protegidos

---

### AUTH-05 · La protección del rol del trigger `prevent_role_update_on_profile` tiene un bypass

> [!WARNING]
> **Severidad: MEDIA** — El trigger verifica `auth.role() = 'authenticated'` pero un service_role key podría bypassearlo.

**Ubicación:** [01_auth_profiles.sql:255-266](file:///c:/Proyecto/Proyecto-Pdisc/db/schema/01_auth_profiles.sql#L255-L266)

**Descripción del riesgo:**
```sql
if old.role <> new.role and auth.role() = 'authenticated' then
    raise exception 'No esta permitido modificar el rol del usuario directamente.';
end if;
```

Si alguien obtiene la `service_role` key, podría modificar roles libremente ya que `auth.role()` devolvería `'service_role'` y no `'authenticated'`.

**Solución recomendada:**
- Bloquear la columna `role` de updates en la RLS policy
- Agregar también la condición `or auth.role() = 'service_role'` si se quiere bloquear incluso con service_role (aunque esto limita la administración)

---

## 🛒 Integridad del Carrito y Datos del Cliente

### CART-01 · El carrito es completamente client-side y manipulable

> [!WARNING]
> **Severidad: ALTA** — Los precios y totales se calculan enteramente en el cliente.

**Ubicación:** [carrito.js](file:///c:/Proyecto/Proyecto-Pdisc/js/carrito.js), [home.js](file:///c:/Proyecto/Proyecto-Pdisc/js/home.js)

**Descripción del riesgo:**
- Los precios se extraen del DOM HTML estático y se guardan en localStorage
- Un usuario puede modificar los precios directamente en DevTools:
  ```javascript
  const cart = JSON.parse(localStorage.getItem('bl_cart'));
  cart[0].price = 1; // Cambiar el precio a $1
  localStorage.setItem('bl_cart', JSON.stringify(cart));
  ```
- No hay validación del precio en el servidor cuando se inicia el pago
- El cupón de descuento `TEST15` está hardcodeado en [carrito.js:177](file:///c:/Proyecto/Proyecto-Pdisc/js/carrito.js#L177), visible para cualquiera que inspeccione el código fuente

**Solución recomendada:**
- Migrar el carrito a la base de datos (asociarlo al usuario autenticado)
- Validar precios y descuentos en el servidor al momento del checkout
- Obtener los cupones válidos desde una tabla de Supabase, no hardcodeados

---

### CART-02 · Código duplicado entre home.js, search.js y carrito.js

> [!IMPORTANT]
> **Severidad: BAJA (seguridad) / MEDIA (mantenimiento)** — Tres copias del mismo código de carrito aumentan la superficie de error.

**Ubicaciones:**
- [home.js:4-21](file:///c:/Proyecto/Proyecto-Pdisc/js/home.js#L4-L21) (getCart, saveCart, parsePrice)
- [search.js:2-20](file:///c:/Proyecto/Proyecto-Pdisc/js/search.js#L2-L20) (getCart, saveCart, parsePrice — idéntico)
- [carrito.js:4-35](file:///c:/Proyecto/Proyecto-Pdisc/js/carrito.js#L4-L35) (getCart, saveCart — idéntico)

Las funciones `getCart()`, `saveCart()`, `parsePrice()`, `showToast()`, `updateCartBadge()`, `initCartButtons()`, e `initWishlist()` están **copiadas literalmente** en 2-3 archivos.

**Solución recomendada:**
- Extraer todas las funciones compartidas a un módulo `js/cart-utils.js`
- Importar desde cada archivo que las necesite:
  ```javascript
  import { getCart, saveCart, parsePrice } from './cart-utils.js';
  ```

---

### CART-03 · El carrito no tiene límite de cantidad ni validación de stock

> [!IMPORTANT]
> **Severidad: MEDIA** — Un usuario puede agregar cantidades ilimitadas de un producto.

**Ubicación:** [carrito.js:219-224](file:///c:/Proyecto/Proyecto-Pdisc/js/carrito.js#L219-L224)

**Descripción:**
```javascript
} else if (btn.classList.contains('cart-qty__plus')) {
  if (cart[index]) {
    cart[index].qty++;  // ← Sin límite superior
  }
}
```

No se verifica el stock disponible del producto. Un usuario podría agregar 999 unidades.

**Solución recomendada:**
- Implementar un límite máximo por producto (ej: 99 o basado en stock real)
- Validar stock en tiempo real contra la base de datos al incrementar

---

## 🌐 Headers de Seguridad y Dependencias CDN

### CDN-01 · Scripts de CDN sin Subresource Integrity (SRI)

> [!WARNING]
> **Severidad: MEDIA-ALTA** — Si el CDN es comprometido, tu sitio ejecutará código malicioso.

**Ubicaciones en todos los HTML:**
```html
<!-- Todas las páginas cargan Font Awesome desde CDN sin SRI -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" />
<!-- Y Google Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
```

**Descripción del riesgo:**  
Sin el atributo `integrity`, si `cdnjs.cloudflare.com` es comprometido (o hay un MITM), el archivo CSS podría contener `@import url()` que cargue JavaScript, o reglas CSS que exfiltren datos del formulario.

**Solución recomendada:**
```html
<link 
  rel="stylesheet" 
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
  integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A=="
  crossorigin="anonymous"
  referrerpolicy="no-referrer"
/>
```

---

### CDN-02 · Versiones inconsistentes de Font Awesome entre páginas

> [!NOTE]
> **Severidad: BAJA** — Pero podría causar inconsistencias visuales o vulnerabilidades en la versión antigua.

**Ubicaciones:**
- [vender.html:8](file:///c:/Proyecto/Proyecto-Pdisc/pages/vender.html#L8): Usa Font Awesome **6.4.0**
- Todas las demás páginas: Usan Font Awesome **6.5.2**

**Solución:** Unificar todas las páginas a la misma versión (6.5.2 o superior).

---

### CDN-03 · No hay meta tag Content-Security-Policy (CSP)

> [!WARNING]
> **Severidad: MEDIA** — Sin CSP, no hay barrera contra inyección de scripts o estilos maliciosos.

**Descripción del riesgo:**  
Ninguna página tiene un meta tag `<meta http-equiv="Content-Security-Policy">` ni se configura vía headers del servidor. Esto permite que cualquier script o estilo inline o de origen externo se ejecute sin restricciones.

**Solución recomendada:**  
Agregar a cada `<head>` (o configurar en el servidor/Vite):
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self'; 
               style-src 'self' https://cdnjs.cloudflare.com https://fonts.googleapis.com 'unsafe-inline'; 
               font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; 
               img-src 'self' data:; 
               connect-src 'self' https://*.supabase.co https://accounts.google.com;">
```

---

### CDN-04 · Faltan headers de seguridad HTTP estándar

> [!IMPORTANT]
> **Severidad: MEDIA** — Sin estos headers, el sitio es vulnerable a clickjacking, MIME-sniffing, y otros ataques.

**Headers faltantes:**
| Header | Propósito |
|--------|-----------|
| `X-Content-Type-Options: nosniff` | Prevenir MIME sniffing |
| `X-Frame-Options: DENY` | Prevenir clickjacking (embebido en iframes) |
| `Referrer-Policy: strict-origin-when-cross-origin` | Limitar datos enviados en el Referer |
| `Permissions-Policy` | Restringir acceso a APIs del navegador (cámara, micro, etc.) |
| `Strict-Transport-Security` | Forzar HTTPS |

**Solución recomendada:**  
Configurar estos headers en el archivo de configuración del servidor de despliegue (Vercel, Netlify, etc.) o con un plugin de Vite.

---

## 🏗️ Oportunidades de Mejora de Código y Arquitectura

### CODE-01 · No existe una configuración de Vite (`vite.config.js`)

> [!NOTE]
> **Severidad: MEDIA (oportunidad de mejora)**

**Descripción:**  
El proyecto no tiene un archivo `vite.config.js`. Esto limita las posibilidades de:
- Configurar aliases de importación
- Agregar plugins de seguridad (CSP, SRI)
- Configurar las páginas del multi-page app correctamente
- Optimizar el build de producción

**Solución recomendada:**
```javascript
// vite.config.js
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        home: resolve(__dirname, 'pages/home.html'),
        login: resolve(__dirname, 'pages/login.html'),
        register: resolve(__dirname, 'pages/register.html'),
        perfil: resolve(__dirname, 'pages/perfil.html'),
        carrito: resolve(__dirname, 'pages/carrito.html'),
        search: resolve(__dirname, 'pages/search.html'),
        vender: resolve(__dirname, 'pages/vender.html'),
      }
    }
  }
});
```

---

### CODE-02 · `vender.js` no usa módulos ES — inconsistencia de carga

> [!NOTE]
> **Severidad: BAJA**

**Ubicación:** [vender.html:209](file:///c:/Proyecto/Proyecto-Pdisc/pages/vender.html#L209) vs [home.html:376](file:///c:/Proyecto/Proyecto-Pdisc/pages/home.html#L376)

**Descripción:**  
```html
<!-- vender.html: script clásico -->
<script src="../js/vender.js"></script>

<!-- home.html: módulo ES -->
<script type="module" src="../js/home.js"></script>
```

`vender.js` se carga como script clásico mientras que el resto de archivos JS usan `type="module"`. Esto causa:
- Que `vender.js` no pueda importar funciones de `auth-utils.js` o Supabase
- Polución del scope global
- Que no se aplique el modo estricto automáticamente

**Solución:** Convertir `vender.js` a módulo ES e integrarlo con Supabase Auth.

---

### CODE-03 · `carrito.js` y `home.js` tampoco usan módulos ES consistentemente

> [!NOTE]
> **Severidad: BAJA**

**Ubicación:** [carrito.html:153](file:///c:/Proyecto/Proyecto-Pdisc/pages/carrito.html#L153)

**Descripción:**
```html
<!-- carrito.html: script clásico -->
<script src="../js/carrito.js"></script>
```

Esto impide que `carrito.js` importe funciones compartidas.

---

### CODE-04 · Error silencioso en la verificación de sesión inicial

> [!NOTE]
> **Severidad: BAJA**

**Ubicación:** [auth-utils.js:141-143](file:///c:/Proyecto/Proyecto-Pdisc/js/auth-utils.js#L141-L143)

```javascript
}).catch(() => {
  // Ignorar error
});
```

Ignorar completamente los errores de `getUser()` puede enmascarar problemas de red o de configuración de Supabase.

**Solución:** Loguear el error al menos en modo desarrollo.

---

### CODE-05 · La página `search.html` tiene el mismo `<title>` que `home.html`

> [!NOTE]
> **Severidad: BAJA (SEO)**

**Ubicación:** [search.html:7](file:///c:/Proyecto/Proyecto-Pdisc/pages/search.html#L7)

```html
<title>Baradero Local — Tu mercado online de Baradero</title>
```

Debería ser algo como `Buscar productos — Baradero Local`.

---

### CODE-06 · Redirección con JavaScript puro en `index.html`

> [!NOTE]
> **Severidad: BAJA (SEO / accesibilidad)**

**Ubicación:** [index.html:7-9](file:///c:/Proyecto/Proyecto-Pdisc/index.html#L7-L9)

```html
<script>
  window.location.replace('./pages/home.html');
</script>
```

Los motores de búsqueda y usuarios sin JavaScript no verán la redirección. Es mejor usar una redirección del servidor o un meta refresh como fallback:
```html
<meta http-equiv="refresh" content="0;url=./pages/home.html">
```

---

### CODE-07 · No hay manejo de errores para `JSON.parse` de localStorage corrupto

> [!NOTE]
> **Severidad: BAJA**

**Ubicación:** [home.js:10-15](file:///c:/Proyecto/Proyecto-Pdisc/js/home.js#L10-L15)

Si bien el `try/catch` existe, no se limpian los datos corruptos:
```javascript
function getCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return []; // ← No limpia el dato corrupto, lo dejará para la próxima
  }
}
```

**Mejora sugerida:** Agregar `localStorage.removeItem(CART_KEY)` en el `catch`.

---

### CODE-08 · La función `handle_new_user` no maneja actualizaciones correctamente

> [!IMPORTANT]
> **Severidad: MEDIA**

**Ubicación:** [01_auth_profiles.sql:177-182](file:///c:/Proyecto/Proyecto-Pdisc/db/schema/01_auth_profiles.sql#L177-L182)

```sql
on conflict (id) do update
  set email = excluded.email,
      ...
      role = coalesce(excluded.role, public.profiles.role),
```

El `ON CONFLICT DO UPDATE` sobreescribe el `role` con el valor del `user_metadata`. Si un usuario hace un nuevo sign-in con Google, su rol podría restablecerse al rol por defecto.

**Solución:** No actualizar el `role` en el `ON CONFLICT`:
```sql
on conflict (id) do update
  set email = excluded.email,
      full_name = coalesce(excluded.full_name, public.profiles.full_name),
      avatar_url = coalesce(excluded.avatar_url, public.profiles.avatar_url),
      -- NO actualizar role
      updated_at = now();
```

---

## 📱 Oportunidades de Mejora UX/UI

### UX-01 · El enlace "¿Olvidaste tu contraseña?" no funciona

**Ubicación:** [login.html:41](file:///c:/Proyecto/Proyecto-Pdisc/pages/login.html#L41)

```html
<a href="#">¿Olvidaste tu contraseña?</a>
```

El `href="#"` no lleva a ningún lado. Supabase tiene un método `auth.resetPasswordForEmail()` que se puede implementar.

---

### UX-02 · No hay confirmación visual al cerrar sesión

**Ubicación:** [perfil.js:53-56](file:///c:/Proyecto/Proyecto-Pdisc/js/perfil.js#L53-L56)

```javascript
async function logout() {
  await supabase.auth.signOut();
}
```

No hay toast ni feedback visual antes de la redirección.

---

### UX-03 · La validación de contraseña es mínima — solo 6 caracteres

**Ubicación:** [register.js:95-98](file:///c:/Proyecto/Proyecto-Pdisc/js/register.js#L95-L98)

Una contraseña de 6 caracteres sin complejidad es muy débil. Se recomienda:
- Mínimo 8 caracteres
- Al menos una mayúscula, un número y un carácter especial
- Usar un medidor visual de fortaleza

---

### UX-04 · Los favoritos se pierden al recargar la página

**Ubicación:** [home.js:107-124](file:///c:/Proyecto/Proyecto-Pdisc/js/home.js#L107-L124)

Los favoritos solo se manejan visualmente (cambiando la clase CSS). No se persisten en `localStorage` ni en la base de datos.

---

### UX-05 · El enlace al perfil muestra la letra "u" hardcodeada

**Ubicación:** [home.html:31](file:///c:/Proyecto/Proyecto-Pdisc/pages/home.html#L31)

```html
<a href="./perfil.html" class="navbar__action-circle" id="nav-profile" aria-label="Mi cuenta">u</a>
```

Debería mostrar la inicial del nombre del usuario o un icono genérico.

---

### UX-06 · Texto placeholder en la sección "Farmacia de turno"

**Ubicación:** [home.html:94-96](file:///c:/Proyecto/Proyecto-Pdisc/pages/home.html#L94-L96)

```html
<div class="farmacia-turno">
  <strong>Farmacia de turno hoy:</strong> nombre de la farmac | direccion ahse 123 | Hasta las 20:00
</div>
```

Contiene texto placeholder que debería ser dinámico o al menos un placeholder más profesional.

---

### UX-07 · El subtítulo del navbar en `vender.html` tiene un error de texto

**Ubicación:** [vender.html:133](file:///c:/Proyecto/Proyecto-Pdisc/pages/vender.html#L133)

```html
<span class="navbar__logo-subtitle">Baradero, más cerca que nunca ashe</span>
```

Tiene un texto "ashe" al final que parece un error de redacción.

---

## 📋 Resumen de Prioridades

| Prioridad | ID | Descripción | Esfuerzo |
|-----------|-----|-------------|----------|
| 🔴 Crítica | SEC-01 | XSS en carrito via innerHTML | Bajo |
| 🔴 Crítica | SEC-02 | XSS en toast via innerHTML + URL params | Bajo |
| 🟠 Alta | AUTH-01 | Vendedor registrado solo en localStorage | Alto |
| 🟠 Alta | AUTH-02 | Rol auto-asignable desde el cliente | Medio |
| 🟠 Alta | CART-01 | Precios manipulables en localStorage | Alto |
| 🟡 Media | CDN-01 | CDN sin SRI (integridad) | Bajo |
| 🟡 Media | CDN-03 | Sin CSP header | Bajo |
| 🟡 Media | CDN-04 | Headers de seguridad faltantes | Bajo |
| 🟡 Media | AUTH-03 | Query sin filtro explícito de usuario | Bajo |
| 🟡 Media | AUTH-05 | Bypass en trigger de protección de rol | Bajo |
| 🟡 Media | CODE-08 | Trigger sobreescribe rol en conflict | Bajo |
| 🟡 Media | CODE-01 | Falta vite.config.js | Medio |
| 🟢 Baja | SEC-03 | Credenciales en .env (esperado para anon key) | Bajo |
| 🟢 Baja | CART-02 | Código duplicado en 3 archivos | Medio |
| 🟢 Baja | CODE-02-07 | Inconsistencias menores de código | Bajo |
| 🟢 Baja | UX-01 a UX-07 | Mejoras de experiencia de usuario | Variado |

---

> [!TIP]
> **Próximos pasos recomendados:**
> 1. Corregir **inmediatamente** las vulnerabilidades XSS (SEC-01 y SEC-02) — son las más fáciles de explotar
> 2. Agregar SRI a los CDN externos (CDN-01) — cambio de 5 minutos
> 3. Planificar la migración del carrito y vendedor al backend (AUTH-01, CART-01)
> 4. Refactorizar el código duplicado (CART-02)
> 5. Implementar un `vite.config.js` con MPA configuration (CODE-01)
