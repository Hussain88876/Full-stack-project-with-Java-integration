<script>
  import ArticleView from "$lib/components/ArticleView.svelte";

  export let data;
  $: article = data.currentArticle;
  $: author = data.author;
</script>

<ArticleView {article} {author} />
