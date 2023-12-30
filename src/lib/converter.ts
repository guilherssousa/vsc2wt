type OriginType = "github-repo" | "vscode-marketplace" | unknown

type VsCodeTheme = {
  origin: string,
  originType: OriginType,
  manifest: any;
}

export async function getTheme(origin: string): Promise<VsCodeTheme>  {
  const theme: VsCodeTheme = {
    origin,
    originType: "unknown",
    manifest: {},
  };

  const url = new URL(origin);

  switch (url.hostname) {
    case "github.com":
      theme.originType = "github-repo";
      theme.manifest = await fetchManifest(origin);
    case "marketplace.visualstudio.com":
      theme.originType = "vscode-marketplace";
  }

  return theme;
}

export async function fetchManifest(repositoryUrl: string)  {
  const [user, repository] = repositoryUrl.split("/").filter(Boolean).slice(-2);
  const manifestUrl = `https://raw.githubusercontent.com/${user}/${repository}/main/package.json`;

  const request = await fetch(manifestUrl);
  const manifest = await request.json();

  return manifest;
}
