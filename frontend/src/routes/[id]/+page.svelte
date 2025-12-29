<script>
  import { decodeHtml, formatDate } from "$lib/js/utils";
  import { onMount } from "svelte";
  import { ART_URL } from "$lib/js/api-urls";
  import { COMMENTS_URL } from "$lib/js/api-urls";
  import { invalidate } from "$app/navigation";
  import { goto } from "$app/navigation";
  import Comment from "$lib/components/Comment.svelte";
  import CommentForm from "$lib/components/CommentForm.svelte";

  export let data;

  let likeCount;
  $: likeNumber = likeCount;
  let userId;
  let articleId = data.article_id;
  let isLiked = false;
  $: error = false;
  $: success = false;
  let comments = [];
  let showComments = false;
  $: isRed = isLiked;

  async function getLikeCount() {
    const response = await fetch(`${ART_URL}/${articleId}/like`, {
      method: "GET",
      credentials: "include"
    });

    const result = await response.json();
    likeCount = result;

    success = response.status === 204;
    error != success;

    if (success) invalidate(`${ART_URL}/${articleId}/like`);
  }

  async function checkIfUserLiked() {
    userId = data.user.user_id;
    const response = await fetch(`${ART_URL}/${articleId}/like/${userId}/check`, {
      method: "GET",
      credentials: "include"
    });
    const result = await response.json();
    isLiked = result;

    success = response.status === 204;
    error != success;

    if (success) invalidate(`${ART_URL}/${articleId}/like/${userId}/check`);
  }

  async function like() {
    userId = data.user.user_id;
    const response = await fetch(`${ART_URL}/${articleId}/like`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId })
    });

    success = response.status === 204;
    error = !success;

    if (success) {
      invalidate(`${ART_URL}/${articleId}/like`);
    }
  }

  async function unLike() {
    userId = data.user.user_id;
    const response = await fetch(`${ART_URL}/${articleId}/unlike`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId })
    });

    success = response.status === 204;
    error = !success;

    if (success) {
      invalidate(`${ART_URL}/${articleId}/unlike`);
    }
  }

  function likeOperation() {
    if (isLiked == false) {
      like();
      getLikeCount();
      checkIfUserLiked();
      isRed = true;
    } else if (isLiked == true) {
      unLike();
      getLikeCount();
      checkIfUserLiked();
      isRed = false;
    } else {
      console.log(`could not conduct like operation`);
    }
  }

  onMount(async () => {
    {
      getLikeCount();
      checkIfUserLiked();
      comments = await fetchComments(articleId);
    }
  });

  // delete
  async function deleteArticle() {
    let user_id = data.user.user_id;
    let is_admin = data.user.is_admin;

    try {
      const response = await fetch(`${ART_URL}/${data.article_id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id, is_admin })
      });

      if (response.ok) {
        // Redirect to home page or another page after successful deletion
        goto("/profile");
      } else {
        console.error("Failed to delete article:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting article:", error);
    }
  }

  export async function fetchComments(articleId) {
    try {
      const response = await fetch(`${COMMENTS_URL}/${articleId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch article comments");
      }
      const comments = await response.json();
      comments.forEach((comment) => {
        comment.desc = decodeHtml(comment.desc);
        comment.date = formatDate(comment.date);
      });
      return comments;
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  }

  function goEdit() {
    goto(`/${articleId}/articleEdit`);
  }

  async function toggleComments() {
    showComments = !showComments;
    if (showComments) {
      comments = await fetchComments(articleId);
    }
  }

  function onComment() {
    setTimeout(async () => {
      comments = await fetchComments(articleId);
    }, 1000);
  }
</script>

<div class="container">
  <article class="article-post">
    {#if data.image != null}
      <div class="article-image">
        <h1>
          <img
            src={data.image}
            width={data.image_width}
            height={data.image_height}
            alt="hi"
            class:full-width={!data.image_width || data.image_width == 0}
          />
        </h1>
      </div>
    {/if}
    <h1 class="article-title">{data.title}</h1>
    <div class="article-content">
      <p class="article-author">{data.username}</p>
      <div class="article-text">{@html data.text}</div>
      <p class="article-date">{formatDate(data.date)}</p>
      {#if data.isLoggedIn}
        {#if data.user.user_id == data.user_id || data.user.is_admin}
          <button type="button" on:click={deleteArticle} class="toggle-comments-btn"
            >Delete Article</button
          >
          <button on:click={goEdit} class="toggle-comments-btn">Edit</button>
        {/if}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
        />
        <button on:click={likeOperation} class="btn" class:red={isRed}
          ><i class="fa fa-heart"></i></button
        >
      {/if}
      <span class="like-text">Likes: {likeNumber}</span>
      <button on:click={toggleComments} class="toggle-comments-btn">
        {showComments ? "Hide Comments" : "Show Comments"}
      </button>
    </div>
  </article>

  <div class="comment-container" style="display: {showComments ? 'block' : 'none'};">
    <div class="comments-tile">
      {#if data.isLoggedIn}
        <div class="leave-comment">
          <h2>Leave your comment!</h2>
          <CommentForm
            on:comment={onComment}
            {data}
            article_id={articleId}
            parent_comment_id={null}
          />
        </div>
      {/if}
      <div class="comments-container">
        <h2>Other Comments:</h2>
        {#if comments}
          {#each comments as comment}
            <Comment on:comment={onComment} {data} {comment} article_id={articleId} />
          {/each}
        {:else}
          <p>No comments to display</p>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  :global(html),
  :global(body) {
    zoom: 0.9;
  }

  .container {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    gap: 2rem;
    padding-top: 2rem;
    height: calc(100vh - 100px); /* Adjust for nav */
    overflow: hidden;
  }

  /* Glass Panels */
  .article-post,
  .comment-container {
    background: var(--glass-bg);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid var(--glass-border);
    box-shadow: var(--glass-shadow);
    border-radius: 16px;
    padding: 2rem;
    height: 100%;
    overflow-y: auto;
    color: var(--text-main);
  }

  .article-post {
    flex: 2;
    max-width: 800px;
  }

  .comment-container {
    flex: 1;
    min-width: 300px;
    margin-left: 0; /* Handled by gap */
    max-height: 100%;
    /* display is handled inline by svelte for logic */
  }

  /* Typography */
  .article-title {
    font-family: var(--font-heading);
    font-size: 2.5rem;
    line-height: 1.2;
    background: linear-gradient(135deg, #fff 0%, #cbd5e1 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 1rem;
  }

  .article-author {
    color: var(--primary);
    font-weight: 500;
    margin-bottom: 2rem;
    font-size: 1rem;
  }

  .article-text {
    font-size: 1.1rem;
    line-height: 1.8;
    color: var(--text-main);
    opacity: 0.9;
    margin-bottom: 2rem;
  }

  .article-date {
    color: var(--text-muted);
    font-size: 0.875rem;
    display: block;
    margin-top: 1rem;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--glass-border);
  }

  /* Images */
  .article-image {
    width: 100%;
    margin-bottom: 2rem;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    display: flex;
    justify-content: center;
  }

  .article-image img {
    max-width: 100%;
    /* width: 100%;  Removed to respect custom width */
    /* height: auto; Removed to respect custom height */
    display: block;
  }

  .article-image img.full-width {
    width: 100%;
  }

  /* Buttons */
  button {
    font-family: var(--font-body);
    transition: all 0.2s;
  }

  .toggle-comments-btn {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: var(--text-main);
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 500;
    margin-right: 0.5rem;
  }

  .toggle-comments-btn:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
  }

  .btn {
    width: 40px;
    height: 40px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-size: 1.25rem;
    color: var(--text-muted);
    background: rgba(255, 255, 255, 0.05);
  }

  .btn:hover {
    background: rgba(255, 255, 255, 0.1);
    color: var(--primary);
  }

  .btn.red {
    color: #ef4444; /* Tailwind red-500 equivalent */
    background: rgba(239, 68, 68, 0.1);
  }

  .like-text {
    margin-left: 0.5rem;
    margin-right: 1.5rem;
    font-weight: 600;
    color: var(--text-main);
  }

  /* Comment Section Headers */
  .leave-comment h2,
  .comments-container h2 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    color: var(--text-main);
    border-bottom: 2px solid var(--primary);
    display: inline-block;
    padding-bottom: 0.25rem;
  }

  /* Scrollbars for these panels */
  .article-post::-webkit-scrollbar,
  .comment-container::-webkit-scrollbar {
    width: 6px;
  }

  .article-post::-webkit-scrollbar-track,
  .comment-container::-webkit-scrollbar-track {
    background: transparent;
  }

  .article-post::-webkit-scrollbar-thumb,
  .comment-container::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
  }

  .article-post::-webkit-scrollbar-thumb:hover,
  .comment-container::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
  }
</style>
