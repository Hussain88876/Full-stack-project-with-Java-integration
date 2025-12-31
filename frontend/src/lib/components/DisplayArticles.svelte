<!-- need to refactor this to fit both profile article display and home page display -->
<script>
  import { onMount } from "svelte";
  import { ART_URL } from "$lib/js/api-urls.js";
  import { decodeHtml, formatDate } from "$lib/js/utils";
  import SearchBar from "./SearchBar.svelte";
  import { page } from "$app/stores";

  let articles = [];
  let sortBy = "date";
  let activeSortOption = "";
  let originalSortBy = "date";
  $: q = $page.url.searchParams.get("q");

  async function fetchArticles() {
    try {
      const response = await fetch(ART_URL);
      if (!response.ok) {
        throw new Error("Failed to fetch articles");
      }
      let data = await response.json();

      // Sort BEFORE formatting dates
      if (sortBy === "date") {
        data.sort((a, b) => new Date(b.date) - new Date(a.date));
      } else if (sortBy === "username") {
        data.sort((a, b) => a.username.localeCompare(b.username));
      } else if (sortBy === "title") {
        data.sort((a, b) => a.title.localeCompare(b.title));
      }

      // Format dates AFTER sorting
      data.forEach((article) => {
        article.text = decodeHtml(article.text);
        article.date = formatDate(article.date);
      });

      return data;
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  }

  async function sortArticles(option) {
    if (sortBy === option) {
      // If the same option is clicked again, reset sortBy and activeSortOption to default
      sortBy = "date";
      activeSortOption = "";
    } else {
      sortBy = option;
      activeSortOption = option;
      originalSortBy = option; // Update original state
    }
    articles = await fetchArticles();
  }

  function getSnippet(html, wordCount) {
    if (!html) return "";
    const text = html.replace(/<[^>]*>?/gm, ""); // strip tags
    const words = text.split(/\s+/);
    if (words.length <= wordCount) return text;
    return words.slice(0, wordCount).join(" ") + "...";
  }

  onMount(async () => {
    articles = await fetchArticles();
  });
</script>

<svelte:head>
  <title>Articles</title>
</svelte:head>

<div class="toolbar">
  <SearchBar />
  <div class="sort-buttons">
    <span class="sort-text">Sort:</span>
    <button
      class="sort-button {activeSortOption === 'username' ? 'active' : ''}"
      on:click={() => sortArticles("username")}>Username</button
    >
    <button
      class="sort-button {activeSortOption === 'title' ? 'active' : ''}"
      on:click={() => sortArticles("title")}>Title</button
    >
    <button
      class="sort-button {activeSortOption === 'date' ? 'active' : ''}"
      on:click={() => sortArticles("date")}>Date</button
    >
  </div>
</div>

<div class="articles-container">
  {#if q != null && articles.length > 0}
    {#each articles as article}
      {#if article.text.toLowerCase().includes(q) || article.title
          .toLowerCase()
          .includes(q) || article.username.toLowerCase().includes(q)}
        <button onclick={`window.location.href='/${article.article_id}'`} class="article-tile">
          {#if article.image}
            <img src={article.image} alt={article.title} class="article-image" />
          {/if}
          {#if !article.image}
            <img src="/images/logoNew.png" alt="Default" class="article-image" />
          {/if}
          <div class="article-content">
            <h2 class="article-title">{article.title}</h2>
            <p class="article-description">{getSnippet(article.text, 20)}</p>
            <p class="author-name">{article.username}</p>
            <p class="article-date">{article.date}</p>
          </div>
        </button>
      {/if}
    {/each}
  {/if}

  {#if q == null && articles.length > 0}
    {#each articles as article}
      <button onclick={`window.location.href='/${article.article_id}'`} class="article-tile">
        {#if article.image}
          <img src={article.image} alt={article.title} class="article-image" />
        {/if}
        {#if !article.image}
          <img src="/images/logoNew.png" alt="Default" class="article-image" />
        {/if}
        <div class="article-content">
          <h2 class="article-title">{article.title}</h2>
          <p class="article-description">{getSnippet(article.text, 20)}</p>
          <div class="article-meta">
            <p class="author-name">{article.username}</p>
            <p class="article-date">{article.date}</p>
          </div>
        </div>
      </button>
    {/each}
  {/if}
</div>

{#if articles.length <= 0}
  <p>No articles found.</p>
{/if}

<style>
  :global(html),
  :global(body),
  .toolbar,
  .articles-container,
  .sort-buttons,
  .sort-text,
  .sort-button,
  .article-tile,
  .author-name,
  .article-date {
    zoom: 0.9;
  }

  .articles-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;
    max-height: 83vh;
    margin-top: 60px;
    overflow-y: auto;
    padding: 20px;
  }

  .articles-container::-webkit-scrollbar {
    width: 8px;
  }

  .articles-container::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
  }

  .articles-container::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 8px;
  }

  .articles-container::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.35);
  }

  .article-tile {
    width: 300px;
    height: 420px;
    margin: 0;
    padding: 0;
    border: 1px solid var(--glass-border);
    border-radius: 8px;
    text-align: left;
    transition: transform 0.3s ease;
    background-color: var(--glass-bg);
    backdrop-filter: blur(4px);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    cursor: pointer;
    position: relative;
  }

  .article-tile:hover {
    transform: scale(1.05);
    box-shadow: var(--glass-shadow);
  }

  .article-image {
    width: 100%;
    height: 180px;
    object-fit: cover;
    background-color: #2a2a2a;
  }

  .article-content {
    padding: 15px;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    justify-content: space-between;
  }

  .article-title {
    font-size: 1.4em;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0 0 10px 0;
    color: var(--text-main);
  }

  .article-description {
    font-size: 0.95em;
    color: var(--text-secondary);
    margin-bottom: 10px;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .article-meta {
    margin-top: auto;
  }

  .author-name {
    font-size: 1em;
    font-style: italic;
    margin: 0;
    color: var(--text-secondary);
  }

  .article-date {
    font-size: 0.9em;
    font-style: italic;
    margin: 2px 0 0 0;
    color: var(--text-muted);
  }

  .sort-buttons {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .sort-text {
    margin-right: 10px;
    font-weight: bold;
    color: var(--text-secondary);
  }

  .sort-button {
    cursor: pointer;
    color: var(--btn-text);
    text-decoration: none;
    background-color: transparent;
    border: 1px solid var(--btn-border);
    border-radius: 4px;
    padding: 8px 12px;
    font: inherit;
    outline: none;
    transition:
      background-color 0.3s,
      color 0.3s,
      transform 0.3s;
  }

  .sort-button:not(:last-child) {
    margin-right: 10px;
  }

  .sort-button:hover {
    background-color: var(--btn-hover-bg);
    color: var(--btn-hover-text);
    transform: translateY(-2px);
  }

  .sort-button.active {
    background-color: var(--btn-hover-bg);
    color: var(--btn-hover-text);
    transform: translateY(-2px);
  }

  .toolbar {
    display: flex;
    align-items: center;
    margin-bottom: 30px;
  }

  .sort-buttons {
    margin-left: auto;
  }
</style>
