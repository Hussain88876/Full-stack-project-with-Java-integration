<script>
  import { goto } from "$app/navigation";
  import { LOGIN_URL } from "$lib/js/api-urls.js";
  import SignupForm from "$lib/components/SignupForm.svelte";
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";

  let username = "";
  let password = "";
  let error = false;
  let createAccountMode = false;

  /**
   * Handles logging in by sending a POST request to /api/auth, with the given username and password.
   *
   * If successful, redirect the user back to the homepage. Otherwise, display an error message.
   */
  async function handleSubmit() {
    error = false;
    const response = await fetch(LOGIN_URL, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    if (response.status === 401) {
      error = true;
    } else {
      goto("/", { invalidateAll: true, replaceState: true });
    }
  }

  function toggleSignUpForm() {
    createAccountMode = !createAccountMode;
  }

  function handleLoginClick(event) {
    createAccountMode = false;
  }

  onMount(() => {
    window.addEventListener("loginClick", handleLoginClick);
    return () => {
      window.removeEventListener("loginClick", handleLoginClick);
    };
  });
</script>

<svelte:head>
  <title>Login</title>
</svelte:head>

{#if createAccountMode}
  <div transition:fade>
    <SignupForm />
  </div>
{:else}
  <!-- {#if showLoginForm} Show the login form if showLoginForm is true -->
  <form on:submit|preventDefault={handleSubmit}>
    <label for="username">Username:</label>
    <input type="text" name="username" bind:value={username} required />
    <label for="password">Password:</label>
    <input type="password" name="password" bind:value={password} required />
    <button type="submit">Login</button>
    <button type="button" on:click={toggleSignUpForm}>Create Account</button>
    {#if error}
      <span class="error">Could not log in with those credentials, please try again.</span>
    {/if}
  </form>
  <!-- {:else} Show the SignupForm component if showLoginForm is false -->
{/if}

<style>
  :global(html),
  :global(body) {
    zoom: 0.9;
  }

  form {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 80px;
    margin-left: 22.5vw;
    max-width: 500px;
    background-color: rgba(255, 255, 255, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 8px;
    padding: 20px;
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 20px;
  }

  input {
    width: 100%;
    padding: 5px;
    border: 1px solid #ddd;
    border-radius: 5px;
    box-sizing: border-box;
    margin-bottom: 5px;
    font-size: 14px;
    transition: border-color 0.3s ease;
  }

  input:focus {
    border-color: #555555;
    outline: none;
  }

  button {
    grid-column: 1 / 3;
    cursor: pointer;
    color: rgb(224, 224, 224);
    text-decoration: none;
    background-color: rgba(66, 66, 66, 0.4);
    border: 1px solid rgb(142, 142, 142);
    border-radius: 4px;
    padding: 8px 12px;
    font: inherit;
    outline: none;
    transition: background-color 0.3s ease;
  }

  button:hover {
    background-color: rgba(66, 66, 66, 0.8);
  }

  .error {
    grid-column: 1 / 3;
    font-weight: bold;
    color: #ff6347;
    background-color: #ffe4e1;
    padding: 10px;
    text-align: center;
    border-radius: 5px;
    font-size: 0.9rem;
  }
</style>
