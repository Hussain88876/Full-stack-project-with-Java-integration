<script>
  import "$lib/css/app.css";
  import { AUTH_URL } from "$lib/js/api-urls.js";
  import ArticleNavbar from "$lib/components/ArticleNavbar.svelte";
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
    <li><a href="/" class:active={path === "/"}>Home</a></li>
    {#if data.isLoggedIn}
      <li><a href="/profile" class:active={path.startsWith("/profile")}>Profile</a></li>
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
  <ArticleNavbar articles={data.articles} />
  <div>
    <slot />
  </div>
</div>

<style>
  nav {
    background-color: rgb(241, 130, 33);
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
      padding: 10px;

      &:hover {
        background-color: rgba(255, 255, 255, 0.2);
      }
    }

    & :is(a, button) {
      color: white;
      font-size: 1.2rem;
      font-weight: bold;
      text-decoration: none;
      background-color: transparent;
      border: 0;
      padding: 0;
      font-family: inherit;
      cursor: pointer;

      &.active {
        text-decoration: underline;
      }
    }

    & > span {
      flex-grow: 1;
    }
  }

  .container {
    display: grid;
    grid-template-columns: auto 1fr;
    column-gap: 3rem;
    margin-top: 1rem;
  }
</style>
