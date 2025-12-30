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
    z-index: 9999;
  }
  .box {
    background: var(--bg-color);
    border: 1px solid var(--glass-border);
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
    color: var(--text-main);
  }
  button {
    margin: 5px;
    padding: 8px 16px;
    background-color: var(--btn-bg);
    color: var(--btn-text);
    border: 1px solid var(--btn-border);
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
  }
  button:hover {
    background-color: var(--btn-hover-bg);
    color: var(--btn-hover-text);
  }
</style>
