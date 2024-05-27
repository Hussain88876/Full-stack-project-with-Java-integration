<script>
    import Article from "$lib/components/Article.svelte";

    export let data;
    $: article = data;

</script>

<Article article = {article}></Article>