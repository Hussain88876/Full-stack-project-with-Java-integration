<script>
    let searchQuery="";
    function caseInsensitiveSearch (){
    searchQuery= searchQuery.toLowerCase();
     console.log(searchQuery)

        

    }
</script>
    

<form id="form" class = "search-form"> 
    <input type="search" id="query" name="q" placeholder="Search..." class = "search-input" bind:value={searchQuery}>
    <button class = "search-button" on:click={caseInsensitiveSearch}>Search</button>
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
        border: 1px solid rgb(142, 142, 142);
        border-radius: 4px;
        outline: none;
    }

    .search-button {
        cursor: pointer;
        color: rgb(224, 224, 224);
        background-color: transparent;
        border: 1px solid rgb(142, 142, 142);
        border-radius: 4px;
        padding: 8px 12px;
        font: inherit;
        outline: none;
        transition: background-color 0.3s, color 0.3s, transform 0.3s;
    }

    .search-button:hover {
        background-color: rgba(255, 255, 255, 0.3);
        color: white;
        transform: translateY(-2px);
    }
</style>
