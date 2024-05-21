<script>
  import "$lib/css/app.css";
  import { AUTH_URL } from "$lib/js/api-urls.js";

  import { page } from "$app/stores";
  import { invalidateAll } from "$app/navigation";
  $: path = $page.url.pathname;
  $: console.log(path);

  export let data;

  /**
   * Handle logout by sending a DELETE request to /api/auth, then invalidating.
   */
  async function handleLogout() {
    const response = await fetch(AUTH_URL, {
      method: "DELETE",
      credentials: "include"
    });
    await invalidateAll();
  }
</script>

<nav>
  <ul>
    <li class="nav-item"><a href="/" class="{path === '/' ? 'active' : ''}"><img src="pk.png" alt="Home" class="nav-img"></a></li>
    {#if data.isLoggedIn}
      <li><a href="/about" class:active={path.startsWith("/about")}>About me</a></li>
    {/if}
  </ul>
  <span />
  <ul>
    <!-- Display the login link OR the logout button, not both. -->
    {#if data.isLoggedIn}
      <li><button on:click={handleLogout}>Logout</button></li>
    {:else}
      <li><a href="/login" class:active={path.startsWith("/login")}>Login</a></li>
    {/if}
  </ul>
</nav>

<div class="container">
  <slot />
</div>

<style>
  nav {
    background-image: linear-gradient(139deg, rgb(124, 0, 0), rgb(226, 7, 7), rgb(207, 108, 15), rgb(237, 141, 30));
    padding-left: 20px;
    padding-right: 20px;
    box-shadow: 0 5px 3px lightgray;
    display: flex;

    & > ul {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      gap: 10px;
    }

    & li {
      padding-left: 10px;
      padding-right: 10px;
      padding-top: 0%;
      padding-bottom: 0%;

      &:hover {
        background-color: rgba(255, 255, 255, 0);
      }
    }

    & :is(a, button) {
    display: inline-flex; /* Use inline-flex to fit content */
    align-items: center; /* Center vertically */
    color: white;
    font-size: 1.1rem;
    font-weight: bold;
    text-decoration: none;
    background-color: transparent;
    border: 0;
    padding: 0;
    font-family: inherit;
    cursor: pointer;
    height: 100%; /* Set height of container */

    /* Center text vertically */
    line-height: 100%; /* Same as container height */

    transition: transform 0.005s; /* Add transition for smooth effect */

    &:hover {
        transform: scale(1.03); /* Scale the element slightly on hover */
    }

    &.active {
        text-decoration: underline;
    }
}



    & > span {
      flex-grow: 1;
    }
  }

  .container {
    width: 1200px;
    margin: 0 auto;

    @media (max-width: 1200px) {
      width: 100%;
    }
  }

  .nav-item {
    /* Add any styles for the list item */
    display: inline-block; /* Ensures the list items are displayed inline */
}

.nav-img {
    width: 75px; /* Adjust the width as needed */
    height: 60px; /* Maintain aspect ratio */
    /* Add any other styles you need for the image */
}

</style>
