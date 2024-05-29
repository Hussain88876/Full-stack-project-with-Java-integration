<script>
  export let data;
  import DisplayArticles from '$lib/components/DisplayArticles.svelte';
</script>

<svelte:head>
  <title>Authentication lab - Home</title>
</svelte:head>

<h1></h1>

<div class="container">
  <DisplayArticles articles={data.articles} />
  <div>
    <slot />
  </div>
</div>

