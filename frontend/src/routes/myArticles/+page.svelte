<script>
  // Import the DisplayArticles component
  import DisplayArticles from '$lib/components/DisplayArticles.svelte';
  import DisplayComments from '$lib/components/DisplayComments.svelte';

  export let data;
  
</script>

<svelte:head>
  <title>My Articles</title>
</svelte:head>

<h1>My Articles</h1>


  <DisplayArticles />
  <DisplayComments user={data.user}/>