<script lang="ts">
  import Output from "./lib/Output.svelte";
  import { getTheme, getThemeFiles, convertToMST, type VsCodeTheme } from "./lib/converter";
  
  let output = "";
  let theme: VsCodeTheme | undefined;

  async function handleFormSubmit(e: SubmitEvent) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    const themeOrigin = formData.get('themeOrigin') as string;
  
    theme = await getTheme(themeOrigin);
    if (!theme) {
      output = "Invalid theme";
      return;
    }

    const themeFiles = await getThemeFiles(theme)
    const convertedThemes = convertToMST(themeFiles)

    output = JSON.stringify(convertedThemes, null, 2);
  }
</script>


<main>
  <div class="container">
    <div class="icons">
      <img src="/vscode.png" alt="VS Code" />
      <img src="/windows-terminal.png" alt="Windows Terminal" />
    </div>

    <h1>
      VS Code to Windows Terminal Theme Converter
    </h1>

    <p>
      This is a simple tool to convert VS Code themes to Window Terminal color schemes. 
      You just need to paste the GitHub repository link for the extension and the
      tool will do the rest.
    </p>

    <div>
      <form on:submit={handleFormSubmit}>
        <input type="text" name="themeOrigin" placeholder="GitHub link, e.g.: https://github.com/catpuccin/vscode.git" />
        <button type="submit">Convert</button>
      </form>
    </div>


    <div class="token-list">
      {#if theme?.manifest?.contributes?.themes}
        <p>Available themes:</p>
        {#each theme.manifest.contributes.themes as themeVariant}
          <div class="token">{themeVariant.label}</div>
        {/each}
      {/if}
    </div>

    <Output text={output} />
  </div>
</main>

<style lang="scss">
  main {
    width: 100vw;
  }

  .container {
    max-width: 720px;
    margin: 0 auto;
  }

  form {
    width: 100%;
    display: flex;
    column-gap: 16px;

    input, button {
      padding: 8px 16px; 
    }

    input {
      width: 100%;
    }
  }

  .icons {
    display: flex;
    align-items: center;
    gap: 8px;

    img {
      height: 32px;
      width: auto;
    }
  }

  .token-list {
    margin-top: 16px;
    display: flex;
    align-items: center;
    column-gap: 16px;
    flex-wrap: wrap;

    .token {
      padding: 4px 8px;
      border: 1px solid #333;
    }
  }
</style>
