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
  let error = false;
  let success = false;
  let buttonEnabled = true;
  let comments = [];

  async function handleEnableButton() {
    if (userId == null) {
      buttonEnabled = false;
    } else {
      buttonEnabled = true;
    }
  }

  async function getLikeCount() {
    const response = await fetch(`${ART_URL}/${articleId}/like`, {
      method: "GET",
      credentials: "include"
    });

    const result = await response.json();
    likeCount = result;

      success = response.status===204;
      error != success
      console.log(likeCount)

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
    console.log(isLiked);

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
    console.log(`hi`);

    if (success) invalidate(`${ART_URL}/${articleId}/like`);
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
    console.log(`bye`);

    if (success) invalidate(`${ART_URL}/${articleId}/unlike`);
  }

  function likeOperation() {
    if (isLiked == false) {
      like();
      getLikeCount();
      checkIfUserLiked();
    } else if (isLiked == true) {
      unLike();
      getLikeCount();
      checkIfUserLiked();
    } else {
      console.log(`could not conduct like operation`);
    }
  }

  onMount(async () => {
    {
      getLikeCount();
      checkIfUserLiked();
      handleEnableButton();
      comments = await fetchComments(articleId);
      console.log(comments);
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
        goto("/");
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

  function goEdit(){
    goto(`/${articleId}/articleEdit`);
  }

</script>

<div class="container">
  <article class="article-post">
    {#if data.image !=null}
    <h1> <img src = {data.image} width={data.image_width} height= {data.image_height} alt = "hi"/></h1>
    {/if}
    <h1 class="article-title">{data.title}</h1>
    <div class="article-content">
      <p class="article-author">{data.username}</p>
      <div class="article-text">{@html data.text}</div>
      <p class="article-date">{formatDate(data.date)}</p>
      {#if data.isLoggedIn}
        {#if data.user.user_id == data.user_id}
          <button type="button" on:click={deleteArticle}>DELETE ARTICLE</button>
        {/if}
      {/if}
    </div>
  </article>
</div>
<button on:click={likeOperation} disabled={!buttonEnabled} class="like-button">Like</button>
<div class="like-text">current like count is {likeNumber}</div>


{#if data.isLoggedIn}
{#if data.user.user_id == data.user_id}
<button on:click ={goEdit}>edit</button>
{/if}
{/if}

<div class="background-test">
{#if data.isLoggedIn}
<h2>Leave your comment!</h2>
<CommentForm {data} article_id={articleId} parent_comment_id={null}/>
{/if}

<h2>Others comments</h2>
{#if comments}
  {#each comments as comment}
    <Comment {data} {comment} article_id={articleId}/>
  {/each}
{:else}
  <p>Comments empty</p>
{/if}
</div>

<style>
  .background-test{
    margin-top: 10px;
    margin-bottom: 10px;
    width: 100%;
    padding: 5px;
    border: 1px solid #ddd;
    border-radius: 5px;
    box-sizing: border-box;
    margin-bottom: 5px;
    font-size: 14px;
    transition: border-color 0.3s ease;
    background-color: #ddd;
  }

  .container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: auto;
      margin-top: 100px;
      margin-bottom: 100px;
  }

  .article-post {
      max-width: 600px;
      padding: 40px;
      border: 1px solid rgba(255, 255, 255, 0.3); 
  border-radius: 8px;
  text-align: left;
  transition: transform 0.3s ease;
  margin-right: 20px; 
  margin-left: 20px;
  background-color: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(4px); }

  .article-title {
      font-size: 2em;
      margin-bottom: 10px;
  }

  .article-author {
      font-size: 0.9em;
      color: #666;
      margin-bottom: 10px;
  }

  .article-text {
      font-size: 1.1em;
      line-height: 1.6;
      margin-bottom: 20px;
  }

  .article-date {
      font-style: italic;
      align-self: flex-end;
  }
  .like-text {
    color: white;
}
.like-button {
  color: black
}

</style>