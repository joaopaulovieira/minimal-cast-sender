<div class="card b--solid bw1 br3 b--gray">
  <slot/>
</div>

<style>
  .card {
    display: flex;
    flex-direction: column;
    margin-top: 30px;
    min-width: 350px;
    max-width: var(--cardMaxWidth);
    padding: 5px;
  }
</style>