import { create } from "zustand";
import type { FileNode, Tab } from "../types";

interface FileState {
  tree: FileNode[];
  openTabs: Tab[];
  activeFileId: string | null;

  setTree: (tree: FileNode[]) => void;
  openFile: (file: Pick<FileNode, "id" | "name" | "language">) => void;
  closeTab: (fileId: string) => void;
  setActiveFile: (fileId: string) => void;
  openLinkedFile: (pathOrName: string) => boolean;

  // real-time WS updates
  addNode: (node: FileNode, parentId: string | null) => void;
  removeNode: (fileId: string) => void;
  renameNode: (fileId: string, name: string) => void;
  updateNodeContent: (fileId: string, content: string) => void;
}

// recursively insert node into tree
function insertNode(
  tree: FileNode[],
  node: FileNode,
  parentId: string | null,
): FileNode[] {
  if (!parentId) return [...tree, node];
  return tree.map((n) => {
    if (n.id === parentId) return { ...n, children: [...n.children, node] };
    return { ...n, children: insertNode(n.children, node, parentId) };
  });
}

// recursively remove node from tree
function removeNode(tree: FileNode[], fileId: string): FileNode[] {
  return tree
    .filter((n) => n.id !== fileId)
    .map((n) => ({ ...n, children: removeNode(n.children, fileId) }));
}

// recursively rename node in tree
function renameNode(
  tree: FileNode[],
  fileId: string,
  name: string,
): FileNode[] {
  return tree.map((n) => {
    if (n.id === fileId) return { ...n, name };
    return { ...n, children: renameNode(n.children, fileId, name) };
  });
}

function updateNodeContentRecursive(
  tree: FileNode[],
  fileId: string,
  content: string,
): FileNode[] {
  return tree.map((n) => {
    if (n.id === fileId) return { ...n, content };
    return {
      ...n,
      children: updateNodeContentRecursive(n.children, fileId, content),
    };
  });
}

function normalizePath(value: string) {
  return value
    .replace(/^\.?\//, "")
    .replace(/\\/g, "/")
    .toLowerCase();
}

function flattenTree(
  tree: FileNode[],
  parentPath = "",
): Array<FileNode & { path: string }> {
  return tree.flatMap((node) => {
    const nodePath = parentPath ? `${parentPath}/${node.name}` : node.name;
    const current = { ...node, path: nodePath };
    return [current, ...flattenTree(node.children, nodePath)];
  });
}

export const useFileStore = create<FileState>((set, get) => ({
  tree: [],
  openTabs: [],
  activeFileId: null,

  setTree: (tree) => set({ tree }),

  openFile: (file) => {
    const { openTabs } = get();
    const exists = openTabs.find((t) => t.id === file.id);
    if (!exists) {
      set({ openTabs: [...openTabs, file], activeFileId: file.id });
    } else {
      set({ activeFileId: file.id });
    }
  },

  closeTab: (fileId) => {
    const { openTabs, activeFileId } = get();
    const filtered = openTabs.filter((t) => t.id !== fileId);
    let next = activeFileId;
    if (activeFileId === fileId) {
      // activate the tab to the left, or right, or null
      const idx = openTabs.findIndex((t) => t.id === fileId);
      next = filtered[idx - 1]?.id ?? filtered[0]?.id ?? null;
    }
    set({ openTabs: filtered, activeFileId: next });
  },

  setActiveFile: (fileId) => set({ activeFileId: fileId }),

  openLinkedFile: (pathOrName) => {
    const target = normalizePath(pathOrName.split("#")[0].split("?")[0]);
    if (!target) return false;

    const candidates = flattenTree(get().tree).filter(
      (node) => node.type === "file",
    );
    const match =
      candidates.find((node) => normalizePath(node.path) === target) ??
      candidates.find((node) => normalizePath(node.name) === target) ??
      candidates.find((node) =>
        normalizePath(node.path).endsWith(`/${target}`),
      );

    if (!match) return false;
    get().openFile(match);
    return true;
  },

  addNode: (node, parentId) =>
    set((s) => ({ tree: insertNode(s.tree, node, parentId) })),

  removeNode: (fileId) =>
    set((s) => ({
      tree: removeNode(s.tree, fileId),
      openTabs: s.openTabs.filter((t) => t.id !== fileId),
      activeFileId: s.activeFileId === fileId ? null : s.activeFileId,
    })),

  renameNode: (fileId, name) =>
    set((s) => ({
      tree: renameNode(s.tree, fileId, name),
      openTabs: s.openTabs.map((t) => (t.id === fileId ? { ...t, name } : t)),
    })),

  updateNodeContent: (fileId: string, content: string) =>
    set((s) => ({
      tree: s.tree.map((n) =>
        n.id === fileId
          ? { ...n, content } // update this node
          : {
              ...n,
              children: updateNodeContentRecursive(n.children, fileId, content),
            },
      ),
      openTabs: s.openTabs.map((t) =>
        t.id === fileId ? { ...t, content } : t,
      ),
    })),
}));
