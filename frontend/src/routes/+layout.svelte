<script>
  import "$lib/css/app.css";

  import { page } from "$app/stores";
  import ImageTest from "$lib/components/UserPhotos.svelte"
  $: path = $page.url.pathname;
</script>

<nav>
  <p>This is the navbar. You will need to style this (if you even want a navbar at all...)</p>
  <ul>
    <li><a href="/" class:active={path === "/"}>Home</a></li>
  </ul>
</nav>

<div>
  Photo testing:

  Select: 
  <ImageTest />
</div>

<div class="container">
  <slot />
</div>
