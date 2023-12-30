<script lang="ts">
  import { codeToHtml } from 'shikiji'

  export let text: string = "[\"Input the link for the theme extension.]\]";
</script>

<div class="output">
  <code>
    <pre>
      {#await (codeToHtml(text, { lang: 'json', theme: "rose-pine" }))}
        <p>Converting...</p>
      {:then html}
        {@html html}
      {:catch error}
        <p>{error.message}</p>
      {/await}
    </pre>
  </code>
</div>

<style>
  .output {
    margin-top: 16px;
    border: 1px solid #333;
    border-radius: 4px;
  }
</style>
