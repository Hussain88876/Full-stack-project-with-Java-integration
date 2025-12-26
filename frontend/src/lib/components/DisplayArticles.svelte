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
      data.forEach((article) => {
        article.text = decodeHtml(article.text);
        article.date = formatDate(article.date);
      });
      if (sortBy === "date") {
        data.sort((a, b) => b.date.localeCompare(a.date));
      } else if (sortBy === "username") {
        data.sort((a, b) => a.username.localeCompare(b.username));
      } else if (sortBy === "title") {
        data.sort((a, b) => a.title.localeCompare(b.title));
      }

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
            <span class="read-more">Read More</span>
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
          <span class="read-more">Read More</span>
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
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
  }

  .articles-container::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 8px;
  }

  .articles-container::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.5);
  }

  .article-tile {
    width: 300px;
    height: 420px;
    margin: 0;
    padding: 0;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 8px;
    text-align: left;
    transition: transform 0.3s ease;
    background-color: rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(4px);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    cursor: pointer;
    position: relative;
  }

  .article-tile:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .article-image {
    width: 100%;
    height: 180px;
    object-fit: cover;
    background-color: #f0f0f0;
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
    color: white;
  }

  .article-description {
    font-size: 0.95em;
    color: #ddd;
    margin-bottom: 10px;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 3;
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
    color: #eee;
  }

  .article-date {
    font-size: 0.9em;
    font-style: italic;
    margin: 2px 0 0 0;
    color: #ddd;
  }

  .read-more {
    margin-top: 10px;
    align-self: flex-start;
    color: #fff;
    font-weight: bold;
    text-decoration: underline;
    font-size: 0.9em;
  }

  .sort-buttons {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .sort-text {
    margin-right: 10px;
    font-weight: bold;
    color: rgb(224, 224, 224);
  }

  .sort-button {
    cursor: pointer;
    color: rgb(224, 224, 224);
    text-decoration: none;
    background-color: transparent;
    border: 1px solid rgb(142, 142, 142);
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
    background-color: rgba(255, 255, 255, 0.3);
    color: white;
    transform: translateY(-2px);
  }

  .sort-button.active {
    background-color: rgba(255, 255, 255, 0.3);
    color: white;
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
