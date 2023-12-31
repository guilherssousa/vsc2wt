<script lang="ts">
  import { type WindowsTerminalTheme } from "./converter";
  export let theme: WindowsTerminalTheme;
</script>

<div 
  class="token"
  style:background-color={theme.background}
  style:color={theme.foreground}
>
  <div class="bubbles">
    <div style:background-color={theme.red} />
    <div style:background-color={theme.green} />
    <div style:background-color={theme.blue} />
  </div>
  <span>{theme.name}</span>
</div>

<style lang="scss">
  .token {
    display: flex;
    align-items: center;
    gap: 8px;

    padding: 4px 8px;
    border: 1px solid #333;

    .bubbles {
      display: flex;
      align-items: center;
      gap: 4px;

      div {
        height: 8px;
        width: 8px;
        border-radius: 4px;
      }
    }
  }
</style>
