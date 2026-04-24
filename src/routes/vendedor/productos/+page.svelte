<script>
  export let data;
  export let form;
</script>

<h1>Panel de vendedor</h1>
<p>Hola, {data.profile.full_name ?? "vendedor"}.</p>

<h2>Crear producto</h2>
{#if form?.formError}
  <p>{form.formError}</p>
{/if}

<form method="POST" action="?/createProduct">
  <label for="title">Titulo</label>
  <input id="title" name="title" type="text" required minlength="3" />

  <label for="description">Descripcion</label>
  <textarea id="description" name="description" rows="3"></textarea>

  <label for="price_cents">Precio (en centavos)</label>
  <input id="price_cents" name="price_cents" type="number" required min="1" />

  <label for="stock">Stock</label>
  <input id="stock" name="stock" type="number" required min="0" />

  <button type="submit">Crear producto</button>
</form>

<h2>Mis productos</h2>
{#if data.productsError}
  <p>{data.productsError}</p>
{:else if data.products.length === 0}
  <p>Aun no tienes productos cargados.</p>
{:else}
  <ul>
    {#each data.products as product}
      <li>
        {product.title} - ${product.price_cents / 100} - stock: {product.stock}
        {#if !product.is_active} (inactivo){/if}
      </li>
    {/each}
  </ul>
{/if}
