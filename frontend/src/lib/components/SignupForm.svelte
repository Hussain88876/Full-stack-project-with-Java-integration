<script>
  import { invalidate } from "$app/navigation";
  import { USER_URL } from "$lib/js/api-urls.js";
  import { onMount } from "svelte";
  import ImageUpload from "$lib/components/ImageUpload.svelte";
  import { writable } from "svelte/store";
  import { goto } from "$app/navigation";

  let firstName = "";
  let lastName = "";
  let username = "";
  let password = "";
  let confirmPassword = "";
  let dob = "";
  let desc = "";
  let error = false;
  let success = false;
  let avatar;
  let images = writable([
    "/images/cat.png",
    "/images/duck.png",
    "/images/bunny.png",
    "/images/squirrel.png",
    "/images/bear.png",
    "/images/penguin.png"
  ]);
  let selectedAvatar = "1";

  function setImage(imgurl1) {
    avatar = imgurl1;
    console.log(avatar);
  }
  function handleUpload(event) {
    const { imageUrl } = event.detail;
    images.update((imgs) => [...imgs, imageUrl]);
  }

  function adjustTextarea() {
    const textarea = document.querySelector('textarea[name="description"]');
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  }
  onMount(() => {
    adjustTextarea();
  });

  async function handleSubmit() {
    error = false;
    if (username_error || password_error) {
      error = true;
      return;
    }

    const response = await fetch(USER_URL, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, firstName, lastName, dob, desc, avatar, password })
    });

    if (response.status === 401) {
      error = true;
    } else {
      location.reload();
    }
  }

  let username_error;

  async function checkName() {
    username_error = null;
    const response = await fetch(USER_URL);
    const userList = await response.json();
    userList.forEach((user) => {
      if (user.username == username) {
        username_error = "Username occupied";
      }
    });
  }

  let password_error;

  function checkPassword() {
    password_error = null;
    if (password !== confirmPassword) {
      password_error = "Password dont match";
    }
  }
</script>

<svelte:head>
  <title>Create Account</title>
</svelte:head>

<div class="container">
  <form on:submit|preventDefault={handleSubmit}>
    <label for="firstName">First Name:</label>
    <input type="text" name="firstName" bind:value={firstName} required />

    <label for="lastName">Last Name:</label>
    <input type="text" name="lastName" bind:value={lastName} required />

    <label for="username">Username:</label>
    <input
      type="text"
      name="username"
      id="username"
      on:blur={checkName}
      bind:value={username}
      required
    />
    {#if username_error}
      <span class="error">{username_error}</span>
    {/if}

    <label for="password">Password:</label>
    <input type="password" name="password" bind:value={password} minlength="5" required />

    <label for="confirmPassword">Confirm Password:</label>
    <input
      type="password"
      name="confirmPassword"
      bind:value={confirmPassword}
      on:blur={checkPassword}
      required
    />
    {#if password_error}
      <span class="error">{password_error}</span>
    {/if}

    <label for="dob">Date of Birth:</label>
    <input type="date" name="dob" bind:value={dob} required />

    <label for="description">Description (max 500 characters):</label>
    <textarea
      name="description"
      bind:value={desc}
      on:input={adjustTextarea}
      maxlength="500"
      required
    ></textarea>

    <label for="profileAvatar">Profile Avatar:</label>
    <div>
      <div>
        {#each $images as imgurl1}
          <label>
            <input
              type="radio"
              name="profileAvatar"
              value="1"
              on:click={() => setImage(imgurl1)}
              required
            />
            <img src={imgurl1} alt="Profile Icon 1" />
          </label>
        {/each}
        <ImageUpload on:upload={handleUpload} />

        <button type="submit">Create Account</button>

        {#if error}
          <span class="error">Could not create account, please try again.</span>
        {/if}
      </div>
    </div>
  </form>
</div>

<style>
  form {
    margin: auto;
    max-width: 500px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 10px;
    padding: 20px;
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 20px;
    background-color: rgba(255, 255, 255, 0.05);
    max-height: 90vh;
    overflow-y: auto;
  }

  ::-webkit-scrollbar {
    width: 6px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 8px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.35);
  }

  input[type="text"],
  textarea {
    width: 100%;
    padding: 5px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 5px;
    box-sizing: border-box;
    margin-bottom: 5px;
    font-size: 14px;
    transition: border-color 0.3s ease;
    background-color: rgba(255, 255, 255, 0.05);
    color: #ffffff;
  }

  input[type="text"]:focus,
  textarea:focus {
    border-color: rgba(255, 255, 255, 0.4);
    outline: none;
  }

  input[type="password"],
  textarea {
    width: 100%;
    padding: 5px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 5px;
    box-sizing: border-box;
    margin-bottom: 5px;
    font-size: 14px;
    transition: border-color 0.3s ease;
    background-color: rgba(255, 255, 255, 0.05);
    color: #ffffff;
  }

  input[type="text"]:focus,
  textarea:focus {
    border-color: rgba(255, 255, 255, 0.4);
    outline: none;
  }

  input[type="date"],
  textarea {
    width: 100%;
    padding: 5px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 5px;
    box-sizing: border-box;
    margin-bottom: 5px;
    transition: border-color 0.3s ease;
    background-color: rgba(255, 255, 255, 0.05);
    color: #ffffff;
  }

  input[type="date"]:focus,
  textarea:focus {
    border-color: rgba(255, 255, 255, 0.4);
    outline: none;
  }

  button {
    padding: 10px 20px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    background-color: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
    color: #e5e5e5;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  button:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: white;
  }

  .error {
    grid-column: 1 / 3;
    font-weight: bold;
    color: #ff6347;
    background-color: #ffe4e1;
    padding: 10px;
    text-align: center;
    border-radius: 5px;
  }

  textarea {
    resize: vertical;
  }

  label {
    display: block;
    margin-bottom: 5px;
  }

  div {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    cursor: pointer;
    transition: transform 0.2s;
  }

  input[type="radio"] {
    display: none;
  }

  input[type="radio"]:checked + img {
    transform: scale(1.1);
  }
</style>
