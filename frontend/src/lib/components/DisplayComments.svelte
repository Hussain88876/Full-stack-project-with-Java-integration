<script>
  import { onMount } from "svelte";
  import { COMMENTS_URL } from "$lib/js/api-urls";
  import { decodeHtml, formatDate } from "$lib/js/utils";
  import CommentBox from "./CommentBox.svelte";
  import { ART_URL } from "$lib/js/api-urls";

  let comments = [];
  export let user;
  // export let articleId;

  //fetches already existing comments
  async function fetchComments(article_id) {
    try {
      const response = await fetch(`${COMMENTS_URL}/${article_id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch article comments");
      }
      const data = await response.json();
      console.log("comment data: ", data);
      data.forEach((comment) => {
        comment.desc = decodeHtml(comment.desc);
        comment.date = formatDate(comment.date);
      });
      return comments;
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  }

  //displays new comment (refer to callback function in CommentBox.svelte)
  function handleCommentPosted(newComment) {
    newComment.desc = decodeHtml(newComment.desc);
    newComment.date = formatDate(newComment.date);
    comments = [...comments, newComment];
  }

  onMount(async () => {
    comments = await fetchComments();
  });

  async function deleteComment(comment_id) {
    let user_id = user.user_id;
    let is_admin = user.is_admin;

    try {
      const response = await fetch(`${COMMENTS_URL}/${comment_id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id, is_admin })
      });

      // Remove the deleted comment from the comments array
      comments = comments.filter((comment) => comment.comment_id !== comment_id);
    } catch (error) {
      console.error("Error deleting comment: ", error);
    }
  }
</script>

{#if comments}
  {#each comments as comment}
    <div class="dialogbox">
      <div class="body">
        <span class="tip tip-up"></span>
        <div class="message">
          <p><strong>{comment.username}</strong></p>
          <p class="comment-date">{comment.time} {comment.date}</p>
          <p>{@html comment.desc}</p>
          <p>{comment.article_id}</p>
          <p>{articleOwnerUserId}</p>
          {#if user.isLoggedIn}
            <!-- {#if comment.user_id == user.user.user_id || user.article.user_id == articleId} -->
              <button type="button" on:click={deleteComment(comment.comment_id)}>DELETE COMMENT</button>
            <!-- {/if} -->
          {/if}
        </div>
      </div>
    </div>
    <CommentBox comment_id = {comment.comment_id}/>
  {/each}
{:else}
  <div class="dialogbox">
    <div class="body">
      <span class="tip tip-up"></span>
      <div class="message">
        <p class="message">No comments found...</p>
      </div>
    </div>
  </div>
{/if}

{#if user.isLoggedIn}
  <CommentBox {user} onCommentPosted={handleCommentPosted} />
{/if}

<style>
  .tip {
    position: absolute;
    background: transparent;
    border: 10px solid #ccc;
    top: -25px;
    left: 10px;
    border-right-color: transparent;
    border-left-color: transparent;
    border-top-color: transparent;
  }

  .dialogbox .body {
    position: relative;
    max-width: 50%;
    height: auto;
    margin: 20px;
    padding: 5px;
    background-color: #ebebeb;
    border-radius: 3px;
    border: 5px solid #ccc;
  }

  .body .message {
    min-height: 30px;
    border-radius: 3px;
    font-family: Arial;
    font-size: 14px;
    line-height: 1.5;
    color: #797979;
  }

  .dialogbox {
    margin: 0, auto;
  }

  .comment-date {
    font-style: italic;
    align-self: flex-end;
  }
</style>
