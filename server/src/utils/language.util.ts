function getLanguage(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase();
  const map: Record<string, string> = {
    ts: "typescript",
    tsx: "typescript",
    js: "javascript",
    jsx: "javascript",
    py: "python",
    cpp: "cpp",
    c: "c",
    h: "c",
    json: "json",
    md: "markdown",
    css: "css",
    scss: "css",
    html: "html",
    yaml: "yaml",
    yml: "yaml",
  };
  return map[ext || ""] || "plaintext";
}

export default getLanguage;
