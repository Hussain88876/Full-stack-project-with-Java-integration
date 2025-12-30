<script>
  import "$lib/css/app.css";
  import { LOGOUT_URL } from "$lib/js/api-urls.js";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { invalidateAll } from "$app/navigation";
  import { theme, toggleTheme } from "$lib/js/theme.js";

  $: path = $page.url.pathname;

  export let data;

  function loginClick() {
    const loginClickEvent = new CustomEvent("loginClick");
    dispatchEvent(loginClickEvent);
  }

  async function handleLogout() {
    const response = await fetch(LOGOUT_URL, {
      method: "POST",
      credentials: "include"
    });
    await invalidateAll();
    goto("/login");
  }
</script>

<nav class="glass-nav">
  <div class="nav-content">
    <a href="/" class="nav-logo">
      <img src="/images/logoNew.png" alt="Home" />
    </a>

    <ul class="nav-links">
      {#if data.isLoggedIn}
        <li><a href="/profile" class:active={path.startsWith("/profile")}>Profile</a></li>
        <li>
          <a href="/postArticle" class:active={path.startsWith("/postArticle")}>Post Article</a>
        </li>
      {/if}
    </ul>

    <div class="nav-actions">
      <button on:click={toggleTheme} class="btn-theme" title="Toggle theme">
        {#if $theme === "dark"}
          ☀️
        {:else}
          🌙
        {/if}
      </button>
      {#if data.isLoggedIn}
        <button on:click={handleLogout} class="btn-logout">Logout</button>
      {:else}
        <a
          href="/login"
          class="btn-login"
          class:active={path.startsWith("/login")}
          on:click={loginClick}>Login</a
        >
      {/if}
    </div>
  </div>
</nav>

<div class="container">
  <slot />
</div>

<style>
  :global(body) {
    padding-top: 80px; /* Space for fixed nav */
  }

  .glass-nav {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    max-width: 1200px;
    height: 70px;
    background: var(--glass-bg);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid var(--glass-border);
    border-radius: 16px;
    box-shadow: var(--glass-shadow);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .nav-content {
    width: 100%;
    padding: 0 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .nav-logo {
    display: flex;
    align-items: center;
    transition: transform 0.2s;
  }

  .nav-logo:hover {
    transform: scale(1.05);
  }

  .nav-logo img {
    height: 40px;
    width: auto;
    opacity: 0.9;
  }

  .nav-links {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    gap: 32px;
  }

  .nav-links a {
    color: var(--text-muted);
    font-weight: 500;
    font-size: 0.95rem;
    position: relative;
    padding: 4px 0;
  }

  .nav-links a:hover,
  .nav-links a.active {
    color: var(--text-main);
  }

  .nav-links a::after {
    content: "";
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 2px;
    background: var(--primary);
    transform: scaleX(0);
    transition: transform 0.2s ease;
    transform-origin: right;
  }

  .nav-links a:hover::after,
  .nav-links a.active::after {
    transform: scaleX(1);
    transform-origin: left;
  }

  .nav-actions {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .btn-theme {
    background: transparent;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    padding: 8px;
    border-radius: 50%;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-main);
  }

  .btn-theme:hover {
    background: var(--hover-bg, rgba(255, 255, 255, 0.1));
    transform: scale(1.1);
  }

  .btn-login,
  .btn-logout {
    border: none;
    background: var(--primary);
    color: var(--primary-content);
    padding: 8px 20px;
    border-radius: 99px;
    font-weight: 600;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 4px 12px rgba(255, 255, 255, 0.15);
  }

  .btn-login:hover,
  .btn-logout:hover {
    background: var(--primary-hover);
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(255, 255, 255, 0.25);
  }

  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 24px;
  }

  @media (max-width: 768px) {
    .glass-nav {
      top: 0;
      width: 100%;
      border-radius: 0;
      border-top: none;
      border-left: none;
      border-right: none;
    }

    .nav-links {
      display: none; /* Mobile menu to be implemented if requested, keeping simple for now to match verified functionality */
    }
  }
</style>
