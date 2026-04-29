<script>
  export let data;
  export let form;
</script>

<h1>Backend MVP status</h1>

{#if data.backendReady}
  <p>Conectado a Supabase y tabla base accesible.</p>
{:else}
  <p>Conexion lista, pero falta schema inicial o permisos.</p>
  {#if data.errorMessage}
    <pre>{data.errorMessage}</pre>
  {/if}
{/if}

{#if data.userLoggedIn}
  <p>Sesion iniciada. Puedes entrar a <a href="/perfil">/perfil</a>.</p>
{:else}
  <form method="POST" action="?/loginLocal">
    <input
      name="identifier"
      type="text"
      placeholder="Email o telefono"
      required
      autocomplete="username"
    />
    <button type="submit">Continuar con acceso local</button>
  </form>

  {#if form?.loginLocalError}
    <p>{form.loginLocalError}</p>
  {/if}

  {#if form?.loginLocalSuccess}
    <p>{form.loginLocalSuccess}</p>
  {/if}

  <form method="POST" action="?/loginWithGoogle">
    <button type="submit">Iniciar sesion con Google</button>
  </form>
{/if}
