<script>
import { configStore } from '../stores/cast_config'
import { castAvailabilityStatus } from '../stores/cast_status'

import SetupButton from './SetupButton.svelte'

  let source = ''
  let mimeType = ''

  let onClickCallback = () => $configStore = { ...$configStore, source, mimeType }
</script>

<h4>Custom Media</h4>
<div class="input-container">
  <span>Media URL:</span>
  <input on:input={ e => source = e.currentTarget.value }>
</div>

<div class="input-container">
  <span>Mime Type:</span>
  <input
  placeholder="'video/mp4' or 'application/x-mpegurl' and etc."
  on:input={ e => mimeType = e.currentTarget.value }>
</div>
<SetupButton {castAvailabilityStatus} {onClickCallback}/>

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