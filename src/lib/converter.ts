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
  manifest: Manifest;
}

const BRANCHES = ["main", "master"];

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
  }

  return theme as VsCodeTheme
}

/* Try over different repositories and branches */
async function fetchManifest(user:string, repository:string, branch: string = "main"): Promise<Manifest | undefined> {
  const manifestUrl = `https://raw.githubusercontent.com/${user}/${repository}/${branch}/package.json`;
  const request = await fetch(manifestUrl);

  if (!request.ok) {
    return undefined 
  }

  return safeParseJson<Manifest>(await request.text())
}

export async function getManifest(repositoryUrl: string): Promise<Manifest | undefined>  {
  const [user, repository] = repositoryUrl.split("/").filter(Boolean).slice(-2);

  for (const branch of BRANCHES) {
    const response = await fetchManifest(user, repository, branch);
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

  console.log(jsonString);

  return JSON.parse(removedComments);
} 
