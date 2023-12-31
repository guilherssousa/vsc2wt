<script lang="ts">
  import Output from "./lib/Output.svelte";
  import ThemeToken from "./lib/ThemeToken.svelte";

  import { getTheme, getThemeFiles, convertToMST, type VsCodeTheme } from "./lib/converter";

  import './theme.scss';
  
  let output = "";
  let theme: VsCodeTheme | undefined;
  let convertedThemes: ReturnType<typeof convertToMST>

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
    convertedThemes = convertToMST(themeFiles)

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


    {#if convertedThemes}
      <p>Available themes:</p>
      <div class="token-list">
        {#each convertedThemes as themeVariant}
          <ThemeToken theme={themeVariant} /> 
        {/each}
      </div>
    {/if}

    <Output text={output} />
  </div>
</main>

<style lang="scss">
  :root {
    font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
    line-height: 1.5;
    font-weight: 400;

    color-scheme: light dark;
    color: var(--white);
    background-color: var(--background);

    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

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
    gap: 32px;

    width: fit-content;
    margin: 0 auto;

    img {
      height: 48px;
      width: auto;
    }
  }

  .token-list {
    margin-top: 8px;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    column-gap: 8px;
    row-gap: 8px;
    flex-wrap: wrap;
   }
</style>
