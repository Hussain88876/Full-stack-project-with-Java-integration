<script>
    import { onMount } from "svelte";
    import { ART_URL } from "$lib/js/api-urls.js";
    import { decodeHtml, formatDate } from '$lib/js/utils';
    import SearchBar from './SearchBar.svelte'; 
    import { page } from '$app/stores';

  let articles = [];
  let sortBy = 'date';
  $: q= $page.url.searchParams.get('q');


  async function fetchArticles() {
      try {
          const response = await fetch(ART_URL);
          if (!response.ok) {
              throw new Error('Failed to fetch articles');
          }
          let data = await response.json();
          data.forEach(article => {
              article.text = decodeHtml(article.text);
              article.date = formatDate(article.date); 
          });
          
          if (sortBy === 'date') {
              data.sort((a, b) => new Date(b.date) - new Date(a.date));
          } else if (sortBy === 'username') {
              data.sort((a, b) => a.username.localeCompare(b.username));
          } else if (sortBy === 'title') {
              data.sort((a, b) => a.title.localeCompare(b.title));
          }
        
          return data;
      } catch (error) {
          console.error('Error fetching articles:', error);
      }
  }

  async function sortArticles(option) {
    sortBy = option;
    articles = await fetchArticles();
  }

  onMount(async () => {
    articles = await fetchArticles();
  });
</script>

<svelte:head>
  <title>Articles</title>
</svelte:head>

<SearchBar/>
<h1>Articles</h1>

<div class="sort-buttons">
  <span class="sort-text">Sort:</span>
  <button class="sort-button" on:click={() => sortArticles('username')}>Username</button>
  <button class="sort-button" on:click={() => sortArticles('title')}>Title</button>
  <button class="sort-button" on:click={() => sortArticles('date')}>Date</button>
</div>

{#if q !=null && articles.length > 0}
  <div>
      {#each articles as article}
      {#if article.text.toLowerCase().includes(q) || article.title.toLowerCase().includes(q) || article.username.toLowerCase().includes(q)}
      <button onclick={`window.location.href='/${article.article_id}'`} class="article-tile">
              <h2>{article.title}</h2>
              <p class="author-name">{article.username}</p>
              <p class="article-date">{article.date}</p>
          </button>
          {/if}
      {/each}
  </div>
{/if}

{#if q ==null && articles.length > 0}
  <div>
      {#each articles as article}
      <button onclick={`window.location.href='/${article.article_id}'`} class="article-tile">
          <h2>{article.title}</h2>
          <p class="author-name">{article.username}</p>
          <p class="article-date">{article.date}</p>
      </button>
      {/each}
  </div>
{/if}

{#if articles.length <= 0 }
<p>No articles found.</p>
{/if}

<style>
  .articles-container {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
  }

  .article-tile {
      width: calc(30.33% - 20px);
      margin-bottom: 20px;
      padding: 20px;
      border: 1px solid #ccc;
      border-radius: 8px;
      text-align: left;
      transition: transform 0.3s ease;
      margin-right: 20px; 
      margin-left: 20px; 
  }

  .article-tile:hover {
      transform: scale(1.05); 
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .article-date {
      font-style: italic;
      align-self: flex-end;
  }

  .author-name {
      font-size: 1.1em;
      font-style: italic;
  }

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
