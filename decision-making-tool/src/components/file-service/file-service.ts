import type { OnErrorHandler, OnLoadHandler } from './file-loader.ts';
import { FileLoader } from './file-loader.ts';

//
//-----------------------------
//  FileService
//-----------------------------
//

const DEF_FILE_TYPE = 'json';

export class FileService {
  private static _instance = new FileService();
  private loader = FileLoader.instance;
  private link = document.createElement('a');

  public static get instance(): FileService {
    return this._instance;
  }

  public set onLoad(handler: OnLoadHandler) {
    this.loader.onLoad = handler;
  }

  public set onError(handler: OnErrorHandler) {
    this.loader.onError = handler;
  }

  public saveText(content: string, fileName: string, fileType: string = DEF_FILE_TYPE): void {
    const { link } = this;
    const file = new Blob([content], { type: 'text/plain' });

    link.href = URL.createObjectURL(file);
    link.download = `${fileName}.${fileType || 'txt'}`;
    link.click();
  }

  public browseForFile(type: string): void {
    const { loader } = this;
    loader.type = type;
    loader.showDialog();
  }
}
