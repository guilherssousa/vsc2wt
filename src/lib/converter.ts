type OriginType = "github-repo" | "vscode-marketplace" | unknown

export type Theme = {};

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
  themes: Theme[],
  manifest: Manifest;
}

const BRANCHES = ["main", "master"];
let BRANCH = BRANCHES[0];

export async function getTheme(origin: string): Promise<VsCodeTheme>  {
  const theme: Partial<VsCodeTheme> = {}

  const url = new URL(origin);

  switch (url.hostname) {
    case "github.com":
      theme.originType = "github-repo";
      theme.manifest = await getManifest(origin);
      break
    case "marketplace.visualstudio.com":
      theme.originType = "vscode-marketplace";
      break
  }

  //theme.themes = await getThemes(theme.manifest.contribues.themes)

  return theme as VsCodeTheme
}

async function getThemes(themeDefinitions: ThemeDefinition[]): Theme[] {
  return [];
}

/* Try over different repositories and branches */
async function fetchGitFile(userRepository: string, file: string, branch: string = "main"): Promise<Manifest | undefined> {
  const manifestUrl = `https://raw.githubusercontent.com/${userRepository}/${branch}/${file}`;
  const request = await fetch(manifestUrl);

  if (!request.ok) {
    return undefined 
  }

  return safeParseJson<Manifest>(await request.text())
}

export async function getManifest(repositoryUrl: string): Promise<Manifest | undefined>  {
  const [user, repository] = repositoryUrl.split("/").filter(Boolean).slice(1);

  for (const branch of BRANCHES) {
    const response = await fetchGitFile(`${user}/${repository}`, "package.json", branch);
    if (response) return response;
  }

  return undefined;
}

/* Assuming VS Code theme files allow comments, we must filter this. */
function safeParseJson<T>(jsonString: string): T {
  const removedComments = jsonString
    .split("\n")
    .filter(line => line && !line.trim().startsWith("//"))
    .join("\n");

  return JSON.parse(removedComments);
} 
