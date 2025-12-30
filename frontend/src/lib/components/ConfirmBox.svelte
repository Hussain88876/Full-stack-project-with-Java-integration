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
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .box {
    background: #1a1a1a;
    border: 1px solid rgba(255, 255, 255, 0.2);
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
    color: #ffffff;
  }
  button {
    margin: 5px;
    padding: 8px 16px;
    background-color: rgba(255, 255, 255, 0.1);
    color: #e5e5e5;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
  }
  button:hover {
    background-color: rgba(255, 255, 255, 0.2);
    color: white;
  }
</style>
