<script>
  export let data;
</script>

<h1>Perfil</h1>

<p><strong>Email:</strong> {data.profile?.email ?? data.user.email}</p>
<p><strong>Nombre:</strong> {data.profile?.full_name ?? "Sin definir"}</p>
<p><strong>Rol:</strong> {data.profile?.role ?? "cliente"}</p>

{#if data.profile?.role === "vendedor" || data.profile?.role === "admin"}
  <p><a href="/vendedor/productos">Ir al panel de vendedor</a></p>
{/if}

<form method="POST" action="?/logout">
  <button type="submit">Cerrar sesion</button>
</form>
