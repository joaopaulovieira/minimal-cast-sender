<script>
  import { configStore } from '../stores/cast_config'
  import { castAvailabilityStatus } from '../stores/cast_status'

  import SetupButton from './SetupButton.svelte'


  let receiverApplicationId = $configStore.receiverApplicationId
  let startWithAutoPlay = true

  let onClickCallback = () => $configStore = { ...$configStore, receiverApplicationId, startWithAutoPlay }
</script>

<h4>Receiver Config</h4>
<div class="app-id-input-container">
  <span>App ID:</span>
  <input
  type="text"
  placeholder="using 'CC1AD845' if no other App ID is configured"
  on:input={ e => {
    receiverApplicationId = e.currentTarget.value.trim() == '' ? 'CC1AD845' : e.currentTarget.value
  } }>
</div>

<div class="autoplay-input-container">
  <span>AutoPlay:</span>
  <input
  type="radio"
  id="autoplay_true"
  name="autoplay"
  value={true}
  on:input={ () => startWithAutoPlay = true }
  checked>
  <label for="autoplay_true">True</label>

  <input
  type="radio"
  id="autoplay_false"
  name="autoplay"
  value={false}
  on:input={ () => { startWithAutoPlay = false } }>
  <label for="autoplay_false">False</label>
</div>

<SetupButton {$castAvailabilityStatus} {onClickCallback}/>

<style>
  h4 {
    margin-bottom: 10px;
  }

  span {
    margin-right: 5px;
    white-space: nowrap;
  }

  input[type="text"] {
    margin-bottom: 5px;
    width: 100%;
  }

  .app-id-input-container {
    display: flex;
    align-items: center;
  }

  .app-id-input-container span {
    margin-right: 25px;
  }

  .autoplay-input-container {
    display: flex;
    align-items: center;
  }

  .autoplay-input-container input {
    margin: 0 10px;
  }

  .autoplay-input-container label {
    margin-left: 5px;
  }
</style>