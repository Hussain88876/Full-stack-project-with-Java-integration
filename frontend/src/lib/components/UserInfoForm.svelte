<script>
  import { invalidate } from "$app/navigation";
  import { USER_URL } from "$lib/js/api-urls.js";
  import { createEventDispatcher } from "svelte";
  import ImageUpload from "$lib/components/ImageUpload.svelte";
  import { writable } from "svelte/store";
  import { uploadImage } from "$lib/js/upload-helper.js";

  export let user;

  const dispatch = createEventDispatcher();

  let username = user.username;
  let dob = user.dob;
  let firstName = user.firstName;
  let lastName = user.lastName;
  let desc = user.desc;
  let avatar = user.avatar;
  let password = "";
  let error = false;
  let success = false;
  let images = writable([
    "/images/cat.png",
    "/images/duck.png",
    "/images/bunny.png",
    "/images/squirrel.png",
    "/images/bear.png",
    "/images/penguin.png"
  ]);

  let uploadedFiles = new Map();

  function setImage(imgurl1) {
    avatar = imgurl1;
    console.log(avatar);
  }
  function handleUpload(event) {
    const { file, imageUrl } = event.detail;
    uploadedFiles.set(imageUrl, file);
    images.update((imgs) => [...imgs, imageUrl]);
  }

  //once user clicks save, sends info to backend to be updated.
  async function handleSave() {
    if (uploadedFiles.has(avatar)) {
      try {
        const file = uploadedFiles.get(avatar);
        avatar = await uploadImage(file);
      } catch (e) {
        console.error("Avatar upload failed:", e);
        error = true;
        return;
      }
    }

    const response = await fetch(`${USER_URL}/me`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, firstName, lastName, dob, password, desc, avatar })
    });

    success = response.status === 204;
    error = !success;

    if (success) invalidate(`${USER_URL}/me`);

    setTimeout(() => {
      dispatch("save");
    }, 700);
  }

  //cancel editing profile
  function cancel() {
    dispatch("cancel");
  }
</script>

<form on:submit|preventDefault={handleSave}>
  <label for="username">Username:</label>
  <input type="text" name="username" bind:value={username} required />
  <label for="firstName">First name:</label>
  <input type="text" name="firstName" bind:value={firstName} required />
  <label for="lastName">Last name:</label>
  <input type="text" name="lastName" bind:value={lastName} required />
  <label for="dob">Date of birth:</label>
  <input type="date" name="dob" bind:value={dob} required />
  <label for="password">Password:</label>
  <input type="password" name="password" bind:value={password} minlength="5" required />
  <label for="description">Description (Max 500 characters):</label>
  <textarea bind:value={desc} rows="12" maxlength="500" required />

  <label for="profileAvatar">Profile Avatar:</label>
  <div>
    <div>
      {#each $images as imgurl1}
        <label>
          <input
            type="radio"
            name="profileAvatar"
            value={imgurl1}
            bind:group={avatar}
            on:click={() => setImage(imgurl1)}
            required
          />
          <img src={imgurl1} alt="Profile Icon 1" />
        </label>
      {/each}
      <ImageUpload on:upload={handleUpload} defer={true} />

      <div class="button-group">
        <button type="submit" class="btn-save">Save</button>
        <button type="button" on:click={cancel} class="btn-cancel">Cancel</button>
      </div>
    </div>
  </div>

  {#if error}<span class="error">Could not save!</span>{/if}
  {#if success}
    <span class="success">Saved!</span>
  {/if}
</form>

<style>
  form {
    margin: auto;
    width: 100%;
    max-width: 500px;
    padding: 20px;
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 10px;
    overflow-y: auto;
    overflow-x: hidden;
    background-color: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-radius: 8px;
    backdrop-filter: blur(4px);
  }

  ::-webkit-scrollbar {
    width: 6px;
  }

  ::-webkit-scrollbar-track {
    background: var(--scrollbar-track);
    border-radius: 8px;
  }

  ::-webkit-scrollbar-thumb {
    background: var(--scrollbar-thumb);
    border-radius: 8px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--scrollbar-thumb-hover);
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

  .button-group,
  textarea,
  .error,
  .success {
    grid-column: 1 / 3;
  }

  .button-group {
    display: flex;
    gap: 10px;
    margin-top: 10px;
  }

  .btn-save,
  .btn-cancel {
    padding: 10px 20px;
    border-radius: 4px;
    font-weight: 500;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 1px solid var(--btn-border);
    background-color: var(--btn-bg);
    color: var(--btn-text);
  }

  .btn-save:hover,
  .btn-cancel:hover {
    background-color: var(--btn-hover-bg);
    color: var(--btn-hover-text);
    transform: translateY(-1px);
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

  input,
  textarea {
    background-color: var(--input-bg);
    border: 1px solid var(--input-border);
    color: var(--text-main);
    padding: 8px;
    border-radius: 4px;
    font-family: inherit;
  }

  input:focus,
  textarea:focus {
    outline: none;
    border-color: var(--input-focus-border);
    background-color: var(--input-bg); /* input-bg works for focus too or use hover-bg */
  }

  input::placeholder,
  textarea::placeholder {
    color: var(--input-placeholder);
  }

  label {
    color: var(--label-color);
    font-weight: 500;
  }
</style>
