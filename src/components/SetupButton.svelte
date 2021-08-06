<!-- <script>
  // state to control button press animation
  let isPressed = false

  // reactivity for update button state
  export let castAvailabilityStatus = false
  $: disableButton = !castAvailabilityStatus
</script>

<button
  class="cast-button bg-dark-blue b--solid br4 bw1 b--white"
  class:disabled={disableButton}
  class:pressed={isPressed}
  disabled={disableButton}
  on:mousedown={ () => isPressed = true }
  on:mouseup={ () => isPressed = false }
  on:touchstart={ () => isPressed = true }
  on:touchend={ () => isPressed = false }
  >
Setup
</button>

<style>
  .cast-button {
    color: white;
    margin-top: 30px;
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
</style> -->