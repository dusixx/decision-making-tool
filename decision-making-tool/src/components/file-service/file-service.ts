import type { OnErrorHandler, OnLoadHandler } from './file-loader.ts';
import { FileLoader } from './file-loader.ts';

class FileService {
  private loader = new FileLoader();
  private link = document.createElement('a');

  public set onLoad(handler: OnLoadHandler) {
    this.loader.onLoad = handler;
  }

  public set onError(handler: OnErrorHandler) {
    this.loader.onError = handler;
  }

  public saveToJSON(content: string, fileName: string): void {
    const { link } = this;
    const file = new Blob([content], { type: 'text/plain' });

    link.href = URL.createObjectURL(file);
    link.download = `${fileName}.json`;
    link.click();
  }

  public browseForFile(type: string): void {
    const { loader } = this;
    loader.type = type;
    loader.showDialog();
  }
}

const instance = new FileService();

export const getFileService = (): FileService => instance;
