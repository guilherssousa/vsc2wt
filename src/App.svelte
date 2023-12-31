<script lang="ts">
  import Output from "./lib/Output.svelte";
  import ThemeToken from "./lib/ThemeToken.svelte";

  import { 
    getTheme,
    getThemeFiles,
    convertToMST,
    themeToVar,
    type VsCodeTheme,
    type WindowsTerminalTheme,
    type ThemeColorDefinitions,
  } from "./lib/converter";

  import './theme.scss';
  
  let theme: VsCodeTheme | undefined;
  let convertedThemes: WindowsTerminalTheme[] | undefined;
  let customStyle: string;
  let output: string;

  async function handleFormSubmit(e: SubmitEvent) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    const themeOrigin = formData.get('themeOrigin') as string;

    const { theme: _theme, error: themeError } = await getTheme(themeOrigin);

    if(themeError) {
      output = themeError;
      return;
    }
  
    theme = _theme;
    let { themeFiles, error: fileError }  = await getThemeFiles(theme as VsCodeTheme)
  
    if (fileError) {
      output = fileError; 
    }

    convertedThemes = convertToMST(themeFiles as ThemeColorDefinitions[])
    customStyle = themeToVar(convertedThemes[0])

    output = JSON.stringify(convertedThemes, null, 2);
  }
</script>


<main style={customStyle}>
  <div class="background" />

  <div class="container">
    <div class="icons">
      <img src="/vscode.png" alt="VS Code" />
      <span>&rarr;</span>
      <img src="/windows-terminal.png" alt="Windows Terminal" />
    </div>

    <h2>
      VS Code to Windows Terminal Theme Converter
    </h2>

    <div class="badges">
      <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Hosted on Vercel" />
      <a href="https://github.com/guilherssousa/vsc2wt/#contributing">
        <img src="https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat" alt="Contributions welcome!"/>
      </a>
    </div>

    <p>
      This is a simple tool to convert VS Code themes to Windows Terminal color schemes. 
      You just need to paste the GitHub repository link for the extension and the
      tool will do the rest.
    </p>

    <div>
      <form on:submit={handleFormSubmit}>
        <input type="text" name="themeOrigin" placeholder="GitHub link, e.g.: https://github.com/catpuccin/vscode.git" />
        <button type="submit">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>

          Convert
        </button>
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
  :global(:root) {
    font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
    line-height: 1.5;
    font-weight: 400;

    color-scheme: light dark;

    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  :global(*) {
    box-sizing: border-box;
  }

  :global(body, html) {
    margin: 0;
  }

  h2 {
    text-align: center;
  }

  main {
    color: var(--white);
    position: relative;
    padding-top: 4rem;
  }

  .background {
    position: absolute;
    top: 0;
    width: 100%;
    height: 200px;
    background-color: var(--blue);
  }

  .container {
    position: relative;
    z-index: 100;
    max-width: 720px;
    margin: 0 auto;
    background-color: var(--black);
    padding: 2rem 1rem;
  }

  form {
    width: 100%;
    display: flex;
    column-gap: 8px;

    input, button {
      padding: 8px 16px; 
      outline: none;
      background-color: var(--background);
      border: 1px solid var(--selectionBackground);
    }

    input {
      width: 100%;
    }

    button {
      display: flex;
      align-items: center;
      font-weight: bold;

      svg {
        color: var(--white);
        height: 24px;
        margin-right: 8px;
      }
    }
  }

  .icons {
    display: flex;
    align-items: center;
    gap: 16px;

    width: fit-content;
    margin: 0 auto;

    span {
      font-size: 2rem;
      font-weight: bold;
    }

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

   .badges {
     display: flex;
     align-items: center;
     gap: 8px;

     a {
       display: flex;
       align-items: center;
     }
   }
</style>
