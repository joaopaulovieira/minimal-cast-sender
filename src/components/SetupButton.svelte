<script>
  import { castAvailabilityStatus } from '../stores/cast_status'

  // state to control button press animation
  let isPressed = false

  export let onClickCallback = () => {}
</script>

<button
  class="setup-button bg-dark-blue b--solid br4 bw1 b--white"
  class:disabled={!$castAvailabilityStatus}
  class:pressed={isPressed}
  disabled={!$castAvailabilityStatus}
  on:mousedown={ () => isPressed = true }
  on:mouseup={ () => isPressed = false }
  on:touchstart={ () => isPressed = true }
  on:touchend={ () => isPressed = false }
  on:click={onClickCallback}
  >
Setup
</button>

<style>
  .setup-button {
    align-self: flex-end;
    color: white;
    height: 40px;
    width: 80px;
    cursor: pointer;
    transform: matrix(1, 0, 0, 1, 0, 0);
    transition: color 1.5s .5s, background-color 1.5s .5s;
  }

  .disabled {
    color: black;
    background-color: #afafaf;
  }

  .pressed {
    transform: matrix(.9, 0, 0, .9, 0, 0);
  }
</style>