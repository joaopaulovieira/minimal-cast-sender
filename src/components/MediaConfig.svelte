<script>
import { configStore } from '../stores/cast_config'
import { getExtension, MIME_TYPES_BY_EXTENSION } from '../utils'
import { castAvailabilityStatus } from '../stores/cast_status'

import SetupButton from './SetupButton.svelte'

  let source = ''
  let mimeType = ''

  let onClickCallback = () => {
    const sourceExtension = getExtension(source)
    mimeType = MIME_TYPES_BY_EXTENSION[sourceExtension]

    $configStore = { ...$configStore, source, mimeType }
  }
</script>

<h4>Media Config</h4>
<div class="input-container">
  <span>Media:</span>
  <input on:input={ e => source = e.currentTarget.value }>
</div>
<SetupButton {$castAvailabilityStatus} {onClickCallback}/>

<style>
  span {
    margin-right: 10px;
    white-space: nowrap;
  }

  input {
    width: 100%;
  }

  .input-container {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
</style>