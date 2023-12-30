<script lang="ts">
  import { getTheme } from "./lib/converter";
  
  let output = "";

  async function handleFormSubmit(e: SubmitEvent) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const themeOrigin = formData.get('themeOrigin') as string;
    
    const theme = await getTheme(themeOrigin);

    output = JSON.stringify(theme, null, 2);
  }
</script>


<main>
  <div class="container">
    <h1>
      VS Code to Microsoft Terminal Theme Converter
    </h1>

    <p>
      This is a simple tool to convert VS Code themes to Microsoft Terminal color schemes. 
      You just need to paste the GitHub repository link for the extension and the
      tool will do the rest.
    </p>

    <div>
      <form on:submit={handleFormSubmit}>
        <input type="text" name="themeOrigin" placeholder="GitHub link, e.g.: https://github.com/catpuccin/vscode.git" />
        <button type="submit">Convert</button>
      </form>
    </div>

    <div class="output">
      <code>
        <pre>{output}</pre>
      </code>
    </div>
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

  .output {
    background-color: #1e1e1e;
    padding: 16px;
  }
</style>
