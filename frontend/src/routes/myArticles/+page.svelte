<script>
  import { onMount } from 'svelte';
  import { NEWUSER_URL } from '$lib/js/api-urls.js';
  import { decodeHtml, formatDate } from '$lib/js/utils';

  export let data;

  let user_id = data.user.user_id;
  let articles = [];
  let sortBy = 'date';

  async function fetchArticles() {
    try {
      const response = await fetch(`${NEWUSER_URL}/${user_id}/articles`);
      if (!response.ok) {
        throw new Error("Failed to fetch user articles");
      }
      let data = await response.json();
            data.forEach(article => {
                article.text = decodeHtml(article.text);
                article.date = formatDate(article.date); 
              
            });
          
            return data;
        } catch (error) {
            console.error('Error fetching articles:', error);
        }
    }
  
    onMount(async () => {
      articles = await fetchArticles();
    });
  </script>
  
  <svelte:head>
    <title>Articles</title>
</svelte:head>

<h1>My Articles</h1>

{#if articles.length > 0}
  <h2>{data.user.username}'s Articles</h2>
  <div class="articles-container">
    {#each articles as article}
    <button onclick={`window.location.href='/${article.article_id}'`} class="article-tile">
      <h2>{article.title}</h2>
      <p class="author-name">{article.username}</p>
      <p class="article-date">{article.date}</p>
  </button>
    {/each}
  </div>
{:else}
  <p>No user articles found.</p>
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