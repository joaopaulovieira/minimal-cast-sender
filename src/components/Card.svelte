<div class="card b--solid bw1 br3 b--gray">
  <slot/>
</div>

<style>
  .card {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-top: 30px;
    min-width: 360px;
    max-width: var(--cardMaxWidth);
    padding: 5px;
  }
</style>