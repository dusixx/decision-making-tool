export type FileData = string | ArrayBuffer | null;

export type OnLoadHandler = ((v: FileData) => void) | null;

export type OnErrorHandler = (() => void) | null;
