function buildTree(files: any[], parentId: string | null = null): any[] {
  return files
    .filter((f) => f.parentId === parentId)
    .map((f) => ({
      ...f,
      children: f.type === "folder" ? buildTree(files, f.id) : [],
    }));
}

export default buildTree;
