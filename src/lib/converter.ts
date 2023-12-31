type OriginType = "github-repo" | "vscode-marketplace" | unknown

export type ThemeDefinition = {
  label: string,
  uiTheme: string,
  path: string,
};

type Manifest = {
  name: string,
  publisher: string,
  version: string,
  description: string,
  scripts?: {
    build?: string;
  },
  repository?: {
    url: string,
  },
  contributes: {
    themes: ThemeDefinition[],
  },
};

export type VsCodeTheme = {
  origin: string,
  originType: OriginType,
  repository: string,
  branch: string,
  manifest: Manifest;
}

type ThemeColorDefinitions = {
  name: string,
  colors : {
    "editor.background": string,
    "terminal.foreground": string,
    "terminal.ansiBlack": string,
    "terminal.ansiBlue": string,
    "terminal.ansiCyan": string,
    "terminal.ansiGreen": string,
    "terminal.ansiMagenta": string,
    "terminal.ansiRed": string,
    "terminal.ansiWhite": string,
    "terminal.ansiYellow": string,
    "terminal.ansiBrightBlack": string,
    "terminal.ansiBrightBlue": string,
    "terminal.ansiBrightCyan": string,
    "terminal.ansiBrightGreen": string,
    "terminal.ansiBrightMagenta": string,
    "terminal.ansiBrightRed": string,
    "terminal.ansiBrightWhite": string,
    "terminal.ansiBrightYellow": string,
    "terminal.selectionBackground": string,
  },
}

export type WindowsTerminalTheme = ReturnType<typeof convertToMST>[0];

type ThemeResult = {
  theme: VsCodeTheme | undefined,
  error: string | undefined,
}

export async function getTheme(origin: string): Promise<ThemeResult>  {
  try {
    const theme: Partial<VsCodeTheme> = {}

    const url = new URL(origin);

    switch (url.hostname) {
      case "github.com":
        theme.originType = "github-repo";
        theme.repository = getRepository(origin)
        theme.branch = await getRepositoryDefaultBranch(theme.repository);
        theme.manifest = await getManifest(theme.repository, theme.branch);
        break 
      case "marketplace.visualstudio.com":
        theme.originType = "vscode-marketplace";
        break
    }

    if (theme.manifest?.scripts?.build) {
      throw new Error("Theme extensions with build scripts are not supported yet.")
    }

    return {
      theme: theme as VsCodeTheme,
      error: undefined,
    } 
  } catch (e: unknown) {
    return {
      theme: undefined,
      error: (e as Error).message,
    }
  }
}

function getRepository(origin: string): string {
  return origin.replace(".git","").split("/").filter(Boolean).slice(2, 4).join("/")
}

async function getRepositoryDefaultBranch(repository: string): Promise<string> {
  const request = await fetch(`https://api.github.com/repos/${repository}`);
  const response = await request.json();
  return response.default_branch;
}


export async function getManifest(repository: string, branch: string): Promise<Manifest | undefined>  {
  const request = await fetch(`https://raw.githubusercontent.com/${repository}/${branch}/package.json`);
  if (request.status !== 200) {
    return undefined;
  }
  return safeParseJson(await request.text());
}

/* Assuming VS Code theme files allow comments, we must filter this. */
function safeParseJson<T>(jsonString: string): T {
  const removedComments = jsonString
    .split("\n")
    .filter(line => line && !line.trim().startsWith("//"))
    .join("\n");

  return JSON.parse(removedComments);
} 

export async function getThemeFiles(theme: VsCodeTheme) {
  try { 
  const promises = theme.manifest.contributes.themes.map(async (themeDefinition) => {
    const request = await fetch(`https://raw.githubusercontent.com/${theme.repository}/${theme.branch}/${themeDefinition.path}`);
    return safeParseJson(await request.text()) as ThemeColorDefinitions
  })

  const ranPromises = await Promise.allSettled(promises);

  const successfulPromises = ranPromises
  .filter(promise => promise.status === "fulfilled") as PromiseFulfilledResult<ThemeColorDefinitions>[];
  
  const results = successfulPromises.map(promise => promise.value);

  return {
      themeFiles: results,
      error: undefined,
    };
  } catch (e: unknown) {
    return {
      files: undefined,
      errror: (e as Error).message,
    }
  }
}

export function convertToMST(themes: ThemeColorDefinitions[]) {
  return themes.map(({ colors, name }) => ({
    name: name,
    background: colors["editor.background"],
    foreground: colors["terminal.foreground"],
    black: colors["terminal.ansiBlack"],
    blue: colors["terminal.ansiBlue"],
    brightBlack: colors["terminal.ansiBrightBlack"],
    brightBlue: colors["terminal.ansiBrightBlue"],
    brightCyan: colors["terminal.ansiBrightCyan"],
    brightGreen: colors["terminal.ansiBrightGreen"],
    brightPurple: colors["terminal.ansiBrightMagenta"],
    brightRed: colors["terminal.ansiBrightRed"],
    brightWhite: colors["terminal.ansiBrightWhite"],
    brightYellow: colors["terminal.ansiBrightYellow"],
    cyan: colors["terminal.ansiCyan"],
    green: colors["terminal.ansiGreen"],
    purple: colors["terminal.ansiMagenta"],
    red: colors["terminal.ansiRed"],
    white: colors["terminal.ansiWhite"],
    yellow: colors["terminal.ansiYellow"],
    selectionBackground: colors["terminal.selectionBackground"],
  }))
}

export function themeToVar(theme: WindowsTerminalTheme) {
  if (!theme) return ``;

  const styles = `
    --white: ${theme.white};
    --blue: ${theme.blue};
    --black: ${theme.black};
    --background: ${theme.background};
    --foreground: ${theme.foreground};
    --selectionBackground: ${theme.selectionBackground};
  `;

  return styles;
}
