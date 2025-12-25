<script>
  import { ART_URL } from "$lib/js/api-urls";
  import { invalidate } from "$app/navigation";
  import { onMount } from "svelte";
  import ImageUpload from "$lib/components/ImageUpload.svelte";
  import { goto } from "$app/navigation";

  export let data;

  let title = "";
  let getText;
  let text = "";
  let error = false;
  let success = false;
  let user_id = data.user.user_id;
  let tempImage;
  let image;
  $: imageWidth = 600;
  $: imageHeight = 200;

  function handleImageSize() {
    // Validation logic is now handled in validation checks, not auto-resizing
  }

  function goBack() {
    setTimeout(() => {
      goto(`/profile`);
    }, 700);
  }

  async function handlePost() {
    error = false;

    // Validation check
    if (imageWidth < 50 || imageWidth > 1200 || imageHeight < 50 || imageHeight > 1200) {
      alert("Image dimensions must be between 50px and 1200px.");
      return;
    }

    const response = await fetch(ART_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, image, imageWidth, imageHeight, text, user_id })
    });

    success = response.status === 204;
    error = !success;

    if (success) invalidate(ART_URL);

    goBack();
  }

  onMount(() => {
    setTimeout(() => {
      tinymce.init({
        selector: "textarea",
        width: "100%",
        height: 300,
        plugins: [
          "advlist",
          "lists",
          "charmap",
          "anchor",
          "pagebreak",
          "searchreplace",
          "wordcount",
          "visualblocks",
          "visualchars",
          "code",
          "fullscreen",
          "insertdatetime",
          "table",
          "emoticons"
        ],
        toolbar:
          "undo redo | styles | bold italic | alignleft aligncenter alignright alignjustify | " +
          "bullist numlist outdent indent  | " +
          "forecolor backcolor emoticons | help",

        content_css: ""
      });

      getText = () => {
        text = tinymce.get("postText").getContent();
      };
    }, 600);
  });

  function handleUpload(event) {
    const { imageUrl } = event.detail;
    tempImage = imageUrl;
    image = tempImage;
  }
</script>

<svelte:head
  ><script
    src="https://cdn.tiny.cloud/1/x0j317jyptd01ki3pnw74apyl45v249opero67lbp6yj5lj7/tinymce/7/tinymce.min.js"
    referrerpolicy="origin"
  ></script></svelte:head
>

<title>Post articles here!</title>

<form on:submit|preventDefault={handlePost}>
  <div class="title-wrapper">
    <label for="title" class="article-text">Title:</label>
    <input type="text" name="title" bind:value={title} required />
  </div>

  {#if image != null}
    <label for="image">
      <img src={image} alt="" width={imageWidth} height={imageHeight} />
    </label>
    <label for="image width" class="dim-text"> Image width (min 50px, max 1200px): </label>
    <input type="number" name="image width" bind:value={imageWidth} min="50" max="1200" required />
    <label for="image height" class="dim-text"> Image height (min 50px, max 1200px): </label>
    <input
      type="number"
      name="image height"
      bind:value={imageHeight}
      min="50"
      max="1200"
      required
    />
  {/if}
  <textarea id="postText" bind:value={text} rows="12" required />

  <ImageUpload on:upload={handleUpload} />
  <button type="submit" on:click={getText} class="toggle-comments-btn">Post!</button>
  {#if error}<span class="error">Could not save!</span>{/if}
  {#if success}<span class="success">Saved!</span>
  {/if}
</form>

<style>
  .toggle-comments-btn {
    cursor: pointer;
    color: rgb(224, 224, 224);
    text-decoration: none;
    background-color: transparent;
    border: 1px solid rgb(142, 142, 142);
    border-radius: 4px;
    padding: 3px 12px;
    margin-right: 10px;
    font: inherit;
    outline: none;
    transition:
      background-color 0.3s,
      color 0.3s,
      transform 0.3s;
  }

  .toggle-comments-btn:hover {
    background-color: rgba(255, 255, 255, 0.3);
    color: white;
    transform: translateY(-2px);
  }

  form {
    display: flex;
    width: 75%;
    margin: auto;
    padding: 10px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 8px;
    background-color: rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(4px);
    display: grid;
    gap: 10px;
    max-height: 100vh;
    overflow-y: auto;
  }

  ::-webkit-scrollbar {
    width: 6px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 8px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.5);
  }

  .title-wrapper {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 10px;
  }

  button,
  textarea,
  .error,
  .success {
    grid-column: 1 / -1;
  }

  .error,
  .success {
    font-weight: bold;
    padding: 5px;
    text-align: center;
  }

  .error {
    color: darkred;
    background-color: lightcoral;
  }

  .success {
    color: darkgreen;
    background-color: lightgreen;
  }

  .dim-text {
    color: white;
  }
  .article-text {
    color: white;
  }
</style>
