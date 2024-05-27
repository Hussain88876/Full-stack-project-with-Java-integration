<script>
  import { onMount } from "svelte";
  import { ART_URL } from "$lib/js/api-urls.js";
  import { decodeHtml, formatDate } from "$lib/js/utils";
  import Article from "$lib/components/Article.svelte";

  $: articles = [];
  let sortBy = "date";

  onMount(async () => {
    articles = await fetchArticles();
    console.log(articles);
  });

  async function fetchArticles() {
    try {
      const response = await fetch(ART_URL);
      if (!response.ok) {
        throw new Error("Failed to fetch articles");
      }
      return data = await response.json();
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  }

  async function sortArticles(option) {
    sortBy = option;
    articles = await fetchArticles();
  }
</script>

<svelte:head>
  <title>Articles</title>
</svelte:head>

<h1>Articles</h1>
<div class="sort-buttons">
  <span class="sort-text">Sort:</span>
  <button class="sort-button" on:click={() => sortArticles("username")}>Username</button>
  <button class="sort-button" on:click={() => sortArticles("title")}>Title</button>
  <button class="sort-button" on:click={() => sortArticles("date")}>Date</button>
</div>

{#each articles as article}
<Article article = {article}></Article>
{/each}

<style>
  .sort-buttons {
    margin-bottom: 10px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .sort-text {
    margin-right: 10px;
    font-weight: bold;
  }
  .sort-button {
    cursor: pointer;
    color: blue;
    text-decoration: underline;
    background: none;
    border: none;
    padding: 0;
    font: inherit;
    outline: inherit;
  }
  .sort-button:not(:last-child) {
    margin-right: 10px;
  }
</style>
