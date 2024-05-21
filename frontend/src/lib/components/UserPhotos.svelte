<script>
  import {PUBLIC_API_BASE_URL} from "$env/static/public";
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store'; // store to see what is happening when we select 

  import FileUpload from './FileUpload.svelte';

  let user = writable({ name: "", imgurl: "" });
  let images = writable ([ `http://localhost:3000/images/1.jpg`,`http://localhost:3000/images/2.jpg`]); // Made this into a writable store, so i can add to it the event 
  
  onMount(async () => { // sets the writible store to the json from the back end as the page loads 
    const response = await fetch(`${PUBLIC_API_BASE_URL}/userSelect`);
    const data = await response.json();
    user.set(data);
  });

  async function selectImage(imgurl) { // patches the backend 
    const response = await fetch(`${PUBLIC_API_BASE_URL}/userSelect`, { // the patch request to the backend 
      method: 'PATCH',
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imgurl }) 
    });

    if (response.status !== 401) { // if response is OK => we update our writble store( This is to see what is going on from the front end side. )
      user.update(u => ({ ...u, imgurl }));
    } else {
      console.error("error");
    }
  }

  function handleUpload(event) {
    const { imageUrl } = event.detail;
    images.update(imgs => [...imgs, imageUrl]);
  }

  async function seeingIfUpdate(){ // testing to see of backedn is updated. 
    const response = await fetch(`${PUBLIC_API_BASE_URL}/userSelect`);
    const data = await response.json();
    console.log(data)

  }
</script>

<div>
  <h1>User Information</h1>
  <div>
    <strong>Name:</strong> {$user.name}
  </div>
  <div>
    <strong>Selected Image URL:</strong> {$user.imgurl}
  </div>
</div>

<div class="image-container">
  {#each $images as imgurl1} 
    <div class="container">
      <img src={imgurl1} alt="Avatar" class="image" style="width:100%"/>
      <div class="middle">
        <button class="text" on:click={() => (selectImage(imgurl1), seeingIfUpdate)}>Select</button>
      </div>
    </div>
  {/each}
</div>


<FileUpload on:upload={handleUpload}/>


<style>
  .container {
    position: relative;
    width: 50%;
  }

  .image {
    opacity: 1;
    display: block;
    width: 100%;
    height: auto;
    transition: 0.5s ease;
    backface-visibility: hidden;
  }

  .middle {
    transition: 0.5s ease;
    opacity: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    text-align: center;
  }

  .container:hover .image {
    opacity: 0.3;
  }

  .container:hover .middle {
    opacity: 1;
  }

  .text {
    color: black;
    font-size: 16px;
    padding: 16px 32px;
    background-color: white;
    border: none;
    cursor: pointer;
  }
</style>