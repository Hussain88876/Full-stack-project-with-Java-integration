<script>
  import CommentForm from "$lib/components/CommentForm.svelte";
  import { createEventDispatcher } from "svelte";
  import { CollapsibleCard } from "svelte-collapsible";
  import { COMMENTS_URL } from "$lib/js/api-urls";

  export let data;
  export let comment, article_id;

  const dispatch = createEventDispatcher();

  let error = false;
  let success = false;
  let commentForm = false;

  function commentChange() {
    dispatch("comment");
  }

  async function deleteComment(comment_id) {
    const user_id = data.user.user_id;
    const is_admin = data.user.is_admin;

    try {
      const response = await fetch(`${COMMENTS_URL}/${comment_id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id, is_admin, article_id })
      });
      if (response.ok) {
        success = true;
        commentChange();
        setTimeout(() => {
          success = false;
        }, 1000);
      } else {
        error = true;
        setTimeout(() => {
          error = false;
        }, 1000);
      }
    } catch (error) {
      console.error("Error deleting comment: ", error);
    }
  }

  function toggleCommentForm() {
    commentForm = !commentForm;
  }
</script>

{#if comment}
  <div class="comment">
    <CollapsibleCard>
      <div slot="header" class="comment-header">
        <img src={comment.avatar} alt="avatar" class="avatar" />
        <h2 class="comment-username">{comment.username}</h2>
      </div>
      <div slot="body" class="comment-body">
        <div class="comment-content">{comment.desc}</div>
        <div class="comment-time">{comment.time} {comment.date}</div>
        {#if data.isLoggedIn}
          <div class="comment-actions">
            <button on:click={toggleCommentForm} class="btn reply-btn" title="Reply">
              Reply
            </button>
            {#if comment.user_id == data.user.user_id || data.user.user_id == data.user_id || data.user.is_admin}
              <button on:click={() => deleteComment(comment.comment_id)} class="btn delete-btn">
                Delete
              </button>
            {/if}
          </div>
          {#if error}
            <div class="error">Could not delete!</div>
          {/if}
          {#if success}
            <div class="success">Deleted!</div>
          {/if}
          {#if commentForm}
            <CommentForm
              on:comment={commentChange}
              {data}
              {article_id}
              parent_comment_id={comment.comment_id}
            />
          {/if}
        {/if}

        {#if comment.children}
          <div class="nested-comments">
            {#each comment.children as child}
              <svelte:self on:comment={commentChange} {data} comment={child} {article_id} />
            {/each}
          </div>
        {/if}
      </div>
    </CollapsibleCard>
  </div>
{/if}

<style>
  .avatar {
    width: 40px;
    height: 40px;
    margin-right: 5px;
  }

  .comment {
    margin-bottom: 20px;
    background-color: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-radius: 8px;
  }

  .comment-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid var(--glass-border);
  }

  .comment-username {
    margin: 0;
    font-size: 1.2em;
    color: var(--text-main);
  }

  .comment-time {
    font-size: 0.8em;
    color: var(--text-muted);
    margin-bottom: 10px;
    margin-left: 20px;
  }

  .comment-body {
    padding: 10px;
  }

  .comment-content {
    font-size: 1.1em;
    margin-bottom: 10px;
    margin-left: 20px;
    color: var(--text-secondary);
  }

  .comment-actions {
    margin-top: 10px;
    display: flex;
    align-items: center;
  }

  .reply-btn,
  .delete-btn {
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 0.8em;
    color: var(--text-secondary);
    margin-left: 4px;
  }

  .reply-btn:hover,
  .delete-btn:hover {
    text-decoration: underline;
    color: var(--text-main);
  }

  .error,
  .success {
    padding: 5px 10px;
    border-radius: 4px;
    margin-top: 10px;
    font-weight: bold;
  }

  .error {
    background-color: #f44336;
    color: #fff;
  }

  .success {
    background-color: #4caf50;
    color: #fff;
  }

  .nested-comments {
    margin-top: 10px;
    margin-left: 15px;
  }
</style>
