<script>
  import { fade } from 'svelte/transition'
  import CastButton from './CastButton.svelte'

  export let castAvailabilityStatus = false
</script>

<div class="header fl w-100 bg-dark-blue helvetica">
  <span class ="title">Minimal Cast Sender</span>
  {#if castAvailabilityStatus}
    <CastButton/>
  {:else}
    <span
    class="status-message light-red"
    transition:fade={{ duration: 1000 }}>Cast Sender SDK is not available</span>
  {/if}
</div>

<style>
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: white;
    padding: 15px 10px;
  }

  .status-message {
    font-size: 14px;
    position: absolute;
    right: 10px;
  }
</style>