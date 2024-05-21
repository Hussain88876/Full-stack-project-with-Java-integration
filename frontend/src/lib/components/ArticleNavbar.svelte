<script>
    import { page } from "$app/stores";
    export let articles = [];
  </script>
  
  <nav>
    {#each articles as article (article.id)}
      <a
        class="nav-link"
        class:active={$page.params.id == article.id}
        href="/articles/{article.id}"
        title={article.title}
      >
        {article.title}
      </a>
    {/each}
  </nav>
  
  <style>
    nav {
      display: flex;
      flex-direction: column;
      border-radius: 1rem;
      box-shadow: 0 0 20px green;
    }
  
    .nav-link {
      padding: 0.5rem 1rem;
      text-align: center;
      text-decoration: none;
      cursor: pointer;
      color: black;
      background-color: rgb(158, 235, 158);
  
      &:nth-child(odd) {
        background-color: rgb(222, 245, 222);
      }
  
      &:first-child {
        border-radius: 1rem 1rem 0 0;
      }
  
      &:last-child {
        border-radius: 0 0 1rem 1rem;
      }
  
      &:is(:hover, .active) {
        font-weight: bold;
        background-color: rgb(37, 152, 37);
        color: white;
      }
  
      /**
       * This is a hack to allow me to "bold" the text while hovering, but not have the thing resize.
       * Source: https://stackoverflow.com/questions/556153/inline-elements-shifting-when-made-bold-on-hover
       */
      &::before {
        content: attr(title);
        font-weight: bold;
        visibility: hidden;
        overflow: hidden;
        height: 0;
        display: block;
      }
    }
  </style>
  