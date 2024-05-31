<script>
  import { COMMENTS_URL } from "$lib/js/api-urls";
  export let data, article_id, parent_comment_id;

  let desc;

  let error = false;
  let success = false;

  async function handleComment() {
    let user_id = data.user.user_id;

    console.log(user_id);

    if (!user_id) {
      error = true;
    } else {
      try {
        const response = await fetch(COMMENTS_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ desc, user_id, article_id, parent_comment_id })
        });

        if (response.status === 204) {
          success = true;
        } else {
          error = true;
        }
      } catch (error) {
        console.error("Error posting comment: ", error);
        error = true;
      }
    }
  }
</script>

<form on:submit|preventDefault={handleComment}>
  <textarea bind:value={desc} placeholder="Leave your comment here!"></textarea>
  <button on:submit={handleComment}>Submit!</button>
  {#if error}<span class="error">Could not save!</span>{/if}
  {#if success}<span class="success" id="success">Saved!</span>{/if}
</form>

<style>
  textarea {
    width: 100%;
    background: rgb(236, 236, 222);
  }

  form {
    padding: 10px;
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 10px;
  }

  button,
  textarea,
  .error,
  .success {
    grid-column: 1 / 3;
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
</style>
