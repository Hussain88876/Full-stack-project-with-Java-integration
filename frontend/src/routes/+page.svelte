<script>
  export let data;
  import { browser } from "$app/environment";
  import { goto } from "$app/navigation";

  /**
   * Whenever the articles list is updated, if we have any articles to display,
   * automatically navigate to the first one.
   */
  $: {
    if (browser && data.articles && data.articles.length > 0) {
      goto(`/${data.articles[0].id}`, { replaceState: true });
    }
  }
</script>

<svelte:head>
  <title>Authentication lab - Home</title>
</svelte:head>

<h1>Home</h1>

{#if data.isLoggedIn}
  <p>Hi {data.user.firstName}! Welcome to your personalized homepage!</p>
{:else}
  <p>Hi there! Please login to see your personalized homepage.</p>
{/if}
