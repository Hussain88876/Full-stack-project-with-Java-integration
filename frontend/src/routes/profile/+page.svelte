<script>
  import { onMount } from "svelte";
  import { USER_URL } from "$lib/js/api-urls.js";
  import { decodeHtml, formatDate } from "$lib/js/utils";
  import UserInfoForm from "$lib/components/UserInfoForm.svelte";
  import { goto } from "$app/navigation";
  import { invalidateAll } from "$app/navigation";
  import { LOGOUT_URL } from "$lib/js/api-urls";
  import ConfirmBox from "$lib/components/ConfirmBox.svelte";

  export let data;

  let user_id = data.user.user_id;
  let articles = [];
  let editMode = false;
  let showConfirmBox = false;

  function confirmDelete() {
    showConfirmBox = true;
  }

  function handleConfirm() {
    showConfirmBox = false;
    deleteUser();
  }

  // Handle cancel action
  function handleCancel() {
    showConfirmBox = false;
  }

  //toggles profile editable version when edit button clicked
  function toggleEditMode() {
    editMode = !editMode;
  }

  function getSnippet(html, wordCount) {
    if (!html) return "";
    const text = html.replace(/<[^>]*>?/gm, ""); // strip tags
    const words = text.split(/\s+/);
    if (words.length <= wordCount) return text;
    return words.slice(0, wordCount).join(" ") + "...";
  }

  async function deleteUser() {
    let user_id = data.user.user_id;
    let is_admin = data.user.is_admin;

    try {
      const response = await fetch(`${USER_URL}/${user_id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id, is_admin })
      });

      if (response.ok) {
        // Redirect to home page or another page after successful deletion
        goto("/");

        const response = await fetch(LOGOUT_URL, {
          method: "POST",
          credentials: "include"
        });
        await invalidateAll();
      } else {
        console.error("Failed to delete user:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  }

  async function fetchArticles() {
    try {
      const response = await fetch(`${USER_URL}/${user_id}/articles`);
      if (!response.ok) {
        throw new Error("Failed to fetch user articles");
      }
      let data = await response.json();
      data.forEach((article) => {
        article.text = decodeHtml(article.text);
        article.date = formatDate(article.date);
      });
      return data;
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  }

  onMount(async () => {
    articles = await fetchArticles();
  });
</script>

<svelte:head>
  <title>Articles</title>
</svelte:head>

<div class="container" class:edit-mode={editMode} class:no-articles={articles.length === 0}>
  <div class="profile-container" class:hidden={editMode}>
    {#if data.user}
      {#if !editMode}
        <div class="profile-info">
          <div class="avatar-container">
            <img src={data.user.avatar} alt="avatar" class="avatar" />
          </div>
          <h2>
            {data.user.username}'s Profile
          </h2>
          <div class="profile-details">
            <div class="profile-detail">
              <span class="detail-label">First Name:</span>
              {data.user.firstName}
            </div>
            <div class="profile-detail">
              <span class="detail-label">Last Name:</span>
              {data.user.lastName}
            </div>
            <div class="profile-detail">
              <span class="detail-label">Date of Birth:</span>
              {data.user.dob}
            </div>
            <div class="profile-detail">
              <span class="detail-label">Username:</span>
              {data.user.username}
            </div>
            <div class="profile-detail">
              <span class="detail-label">Description:</span>
              {data.user.desc}
            </div>
          </div>
          <div class="profile-actions">
            <button on:click={toggleEditMode}>Edit</button>
            <button on:click={confirmDelete}>Delete Account</button>
          </div>
        </div>
      {/if}
    {/if}
  </div>

  {#if editMode && data.user}
    <div class="edit-form-container">
      <UserInfoForm user={data.user} on:save={toggleEditMode} on:cancel={toggleEditMode} />
    </div>
  {/if}

  {#if showConfirmBox}
    <ConfirmBox
      message="Are you sure you want to delete your account?"
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  {/if}

  {#if articles.length > 0 && !editMode}
    <div class="articles-container">
      {#each articles as article}
        <button onclick={`window.location.href='/${article.article_id}'`} class="article-tile">
          {#if article.image}
            <img src={article.image} alt={article.title} class="article-image" />
          {/if}
          {#if !article.image}
            <img src="/images/logoNew.png" alt="Default" class="article-image" />
          {/if}
          <div class="article-content">
            <h2 class="article-title">{article.title}</h2>
            <p class="article-description">{getSnippet(article.text, 20)}</p>
            <p class="author-name">{article.username}</p>
            <p class="article-date">{article.date}</p>
            <span class="read-more">Read More</span>
          </div>
        </button>
      {/each}
    </div>
  {/if}
</div>

<style>
  :global(html),
  :global(body),
  .articles-container,
  .article-tile,
  .article-date {
    zoom: 0.9;
  }

  .container {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 20px;
    margin: 50px auto 40px auto;
    padding: 10px 40px;
    max-width: 1600px;
    width: 100%;
  }

  .container.edit-mode {
    justify-content: center;
    align-items: center;
  }

  .container.no-articles {
    justify-content: center;
  }

  .profile-container.hidden {
    display: none;
  }

  .edit-form-container {
    width: 100%;
    max-width: 500px;
    display: flex;
    justify-content: center;
  }

  .profile-container {
    width: 30%;
    max-width: 400px;
    flex-shrink: 0;
    padding: 20px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 8px;
    background-color: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(4px);
  }

  .profile-info {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .profile-info h2 {
    font-size: 1.5em;
    margin-bottom: 20px;
  }

  .profile-details {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 10px;
    margin-bottom: 20px;
  }

  .detail-label {
    font-weight: bold;
  }

  .profile-actions {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }

  .profile-actions button {
    cursor: pointer;
    color: #e5e5e5;
    text-decoration: none;
    background-color: transparent;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 4px;
    padding: 8px 12px;
    margin-right: 10px;
    font: inherit;
    outline: none;
    transition:
      background-color 0.3s,
      color 0.3s,
      transform 0.3s;
  }

  .profile-actions button:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: white;
    transform: translateY(-2px);
  }
  .avatar-container {
    display: flex;
    justify-content: center;
  }

  .avatar {
    width: 70px;
    height: 70px;
    border-radius: 50%;
  }

  .articles-container {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-content: flex-start;
    gap: 15px;
    max-height: 70vh;
    overflow-y: auto;
    padding: 10px;
  }

  .articles-container::-webkit-scrollbar {
    width: 8px;
  }

  .articles-container::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
  }

  .articles-container::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 8px;
  }

  .articles-container::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.35);
  }

  .article-tile {
    width: 220px;
    height: 320px;
    margin: 0;
    padding: 0;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 8px;
    text-align: left;
    transition: transform 0.3s ease;
    background-color: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(4px);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    cursor: pointer;
  }

  .article-tile:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 8px rgba(255, 255, 255, 0.1);
  }

  .article-image {
    width: 100%;
    height: 130px;
    object-fit: cover;
    background-color: #2a2a2a;
  }

  .article-content {
    padding: 12px;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    justify-content: space-between;
  }

  .article-title {
    font-size: 1.1em;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0 0 8px 0;
    color: white;
  }

  .article-description {
    font-size: 0.85em;
    color: #d4d4d4;
    margin-bottom: 8px;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .author-name {
    font-size: 0.9em;
    font-style: italic;
    margin: 0;
    color: #e5e5e5;
  }

  .article-date {
    font-size: 0.8em;
    font-style: italic;
    margin: 2px 0 0 0;
    color: #d4d4d4;
  }

  .read-more {
    margin-top: 8px;
    align-self: flex-start;
    color: #fff;
    font-weight: bold;
    text-decoration: underline;
    font-size: 0.8em;
  }
</style>
