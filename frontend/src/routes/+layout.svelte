<script>
  import "$lib/css/app.css";
  import { LOGOUT_URL } from "$lib/js/api-urls.js";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { invalidateAll } from "$app/navigation";
  $: path = $page.url.pathname;
  $: console.log(path);

  export let data;

  
  async function handleLogout() {
    const response = await fetch(LOGOUT_URL, {
      method: "POST",
      credentials: "include"
    });
    await invalidateAll();
    goto("/login");
  }
</script>

<nav>
  <ul>
    <li class="nav-item"><a href="/" class="{path === '/' ? 'active' : ''}"><img src="/images/logoNew.png" alt="Home" class="nav-img"></a></li>
    {#if data.isLoggedIn}
      <li><a href="/profile" class:active={path.startsWith("/profile")}>Profile</a></li>
      <li><a href="/postArticle" class:active={path.startsWith("/postArticle")}>Post Articles</a></li>
      <li><a href="/myArticles" class:active={path.startsWith("/myArticles")}> My Articles</a><li>
    {/if}
  </ul>
  <span />
  <ul>
    {#if data.isLoggedIn}
      <li><button on:click={handleLogout}>Logout</button></li>
    {:else}
      <li><a href="/login" class:active={path.startsWith("/login")}>Login</a></li>
      <li><a href="/create-account" class:active={path.startsWith("/create-account")}>Create Account</a></li>
    {/if}
  </ul>
</nav>

<div class="container">
  <slot />
</div>

<style>
   nav {
      height: 12%;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      margin-left: 40px;
      margin-right: 40px;

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
    display: inline-flex; 
    align-items: center; 
    color: #fff;
    font-size: 15px;
    font-weight: bold;
    text-decoration: none;
    background-color: transparent;
    border: 0;
    padding: 0;
    font-family: inherit;
    cursor: pointer;
    height: 100%; 

    
    line-height: 100%; 

    transition: transform 0.005s; 

    &:hover {
        transform: scale(1.03); 
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
    
    display: inline-block; 
}

.nav-img {
    width: 55px; 
    height: 55px; 
    cursor: pointer;
    opacity: 0.5;
}

</style>
