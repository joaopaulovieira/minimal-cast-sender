<script>
  import { configStore } from '../stores/cast_config'
</script>

<h4>Custom Media</h4>
<div class="input-container">
  <span>Media URL:</span>
  <input on:input={ e => $configStore = { ...$configStore, source: e.currentTarget.value } }>
</div>
<div class="input-container">
  <span>Mime Type:</span>
  <input
  placeholder="'video/mp4' or 'application/x-mpegurl' and etc."
  on:input={ e => $configStore = { ...$configStore, mimeType: e.currentTarget.value } }>
</div>

<style>
  h4 {
    margin-bottom: 10px;
  }

  span {
    margin-right: 10px;
    white-space: nowrap;
  }

  input {
    margin-bottom: 5px;
    width: 100%;
  }

  .input-container {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
</style>