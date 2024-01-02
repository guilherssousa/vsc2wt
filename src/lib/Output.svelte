<script lang="ts">
  export let text: string = "[Input the link for the theme extension.]";
</script>

<div class="output">
  <code>
    <pre>
{text}     
    </pre>
  </code>
</div>

<style>
  .output {
    background-color: var(--background);
    margin-top: 16px;
    padding: 0.5rem 1rem;
    border: 1px solid var(--selectionBackground);
    border-radius: 4px;
    overflow-x: auto;
  }
</style>
