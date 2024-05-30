<script>
  import { COMMENTS_URL } from "$lib/js/api-urls";
  export let user, article_id, parent_comment_id;
  export let onCommentPosted;

  let desc;

  let error = false;
  let success = false;

  let user_id = user.user_id;
  let username = user.username;

  async function handleComment() {

    console.log(user_id);
    console.log(username);

    const newComment = {
      desc,
      user_id,
      username,
      date: new Date().toISOString().slice(0, 10),
      time: new Date().toISOString().slice(11, 19)
    };

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
          desc = ""; //clears the comment box
        onCommentPosted(newComment); //callback function to display new comments at the instance of posting
        } else {
          error = true;
        }
      } catch (error) {
        console.error("Error posting comment: ", error);
        error = true;
      }
    }

    // setTimeout(() => {
    //   window.location.reload();
    // }, 1000);
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
