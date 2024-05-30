<script>
  import CommentForm from "$lib/components/CommentForm.svelte";
  import { CollapsibleCard } from "svelte-collapsible";

  export let user;
  export let comment, article_id;
  export let onCommentPosted;
  export let onDelete;

  async function deleteComment(comment_id) {
   await onDelete(comment_id); // Call the passed delete function
  }

</script>

{#if comment}
  <CollapsibleCard>
    <h2 slot="header">{comment.desc}</h2>
    <div slot="body">
      <span><strong>user: {comment.username}</strong></span>
      <span>time: {comment.time} {comment.date}</span>
      <p>{comment.desc}</p>
      {#if user.isLoggedIn}
        <button on:click={() => deleteComment(comment.comment_id)}>DELETE COMMENT</button>
        <CommentForm {onCommentPosted} {user} {article_id} parent_comment_id={comment.comment_id} />
      {/if}
      <li>
        {#if comment.children}
          {#each comment.children as child}
            <svelte:self {onCommentPosted} {user} comment={child} {article_id} {onDelete}/>
          {/each}
        {/if}
      </li>
    </div>
  </CollapsibleCard>
{/if}

<style>
</style>
