<script>
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";

  let searchQuery = $page.url.searchParams.get("q") || "";

  function handleInput() {
    const query = searchQuery.toLowerCase().trim();
    if (query) {
      goto(`?q=${encodeURIComponent(query)}`, { replaceState: true, keepFocus: true });
    } else {
      goto("?", { replaceState: true, keepFocus: true });
    }
  }
</script>

<form id="form" class="search-form" on:submit|preventDefault>
  <input
    type="search"
    id="query"
    name="q"
    placeholder="Search by content, username, or title..."
    class="search-input"
    bind:value={searchQuery}
    on:input={handleInput}
  />
</form>

<style>
  .search-form {
    margin-bottom: 10px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    text-align: center;
  }

  .search-input {
    margin-right: 10px;
    padding: 8px 12px;
    font: inherit;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 4px;
    outline: none;
    width: 350px;
    background-color: rgba(255, 255, 255, 0.05);
    color: #ffffff;
  }

  .search-input::placeholder {
    color: #9ca3af;
  }
</style>
