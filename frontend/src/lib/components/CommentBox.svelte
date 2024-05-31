<script>
  import { COMMENTS_URL } from "$lib/js/api-urls";

  export let comment_id;
  export let onCommentPosted;

  let desc = "";
  let user_id = user.user.user_id;
  let username = user.user.username;

  async function handleComment() {
    let error = false;
    let success = false;

    //prevents posting empty comment
    if (!desc.trim()) {
      error = true;
      return;
    }

    const newComment = {
      desc,
      user_id,
      username,
      date: new Date().toISOString().slice(0, 10),
      time: new Date().toISOString().slice(11, 19)
    };

    try {
     
      const response = await fetch(COMMENTS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ desc, user_id })
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
</script>

<form on:submit|preventDefault={handleComment}>
  <p class="text">
    <textarea bind:value={desc} name="desc" class="desc" id="comment" placeholder="Comment"
    ></textarea>
  </p>
  <div class="submit">
    <input type="submit" value="COMMENT" id="button-blue" />
    <div class="ease"></div>
  </div>
</form>

<style>
  .desc {
    width: 50%;
    height: 80px;
    line-height: 150%;
    resize: vertical;
  }

  input:hover,
  textarea:hover,
  input:focus,
  textarea:focus {
    background-color: white;
  }

  #button-blue {
    float: left;
    width: 20%;
    border: #fbfbfb solid 4px;
    cursor: pointer;
    background-color: #3498db;
    color: white;
    font-size: 14px;
    padding: 10px;
    -webkit-transition: all 0.3s;
    -moz-transition: all 0.3s;
    transition: all 0.3s;
    margin-top: -4px;
    font-weight: 700;
  }

  #button-blue:hover {
    background-color: rgba(0, 0, 0, 0);
    color: #0493bd;
  }

  .submit:hover {
    color: #3498db;
  }

  .ease {
    width: 0px;
    height: 74px;
    background-color: #fbfbfb;
    -webkit-transition: 0.3s ease;
    -moz-transition: 0.3s ease;
    -o-transition: 0.3s ease;
    -ms-transition: 0.3s ease;
    transition: 0.3s ease;
  }

  .submit:hover .ease {
    width: 100%;
    background-color: white;
  }
</style>
