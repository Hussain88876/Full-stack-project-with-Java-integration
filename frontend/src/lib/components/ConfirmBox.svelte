<script>
  export let message;
  export let onConfirm;
  export let onCancel;
</script>

<div class="box-overlay">
  <div class="box">
    <p>{message}</p>
    <button on:click={onConfirm}>Yes</button>
    <button on:click={onCancel}>No</button>
  </div>
</div>

<style>
  .box-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .box {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    color: #333;
  }
  button {
    margin: 5px;
  }
</style>
