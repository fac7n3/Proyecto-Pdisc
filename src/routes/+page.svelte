<script>
  export let data;
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
  <form method="POST" action="?/loginWithGoogle">
    <button type="submit">Iniciar sesion con Google</button>
  </form>
{/if}
