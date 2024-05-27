<script>
  let article;
</script>

{#if article}
  <div class="article-tile">
    <h2>{article.title}</h2>
    <p class="author-name">{article.username}</p>
    {@html article.text}
    <p class="article-date">{article.date}</p>
  </div>
{:else}
  <p>No articles found.</p>
{/if}

<style>
  .article-tile {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    margin-bottom: 20px;
    text-align: left;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  .article-date {
    font-style: italic;
    align-self: flex-end;
  }
  .author-name {
    font-size: 1.1em;
    font-style: italic;
  }
</style>
