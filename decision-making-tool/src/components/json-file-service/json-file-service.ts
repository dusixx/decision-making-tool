import { anchor } from '../base/tags.ts';
import { TextFileReader } from './text-file-reader.ts';
import type { OnErrorHandler, OnLoadHandler } from './types.ts';

enum JSONOptions {
  Filter = '.json',
  MIMEType = 'application/json',
}

export class JSONFileService {
  private fileReader = new TextFileReader();
  private link = anchor();

  public set onLoad(handler: OnLoadHandler) {
    this.fileReader.onLoad = handler;
  }

  public set onError(handler: OnErrorHandler) {
    this.fileReader.onError = handler;
  }

  public save(json: string, fileName: string): void {
    const { link } = this;
    const file = new Blob([json], { type: JSONOptions.MIMEType });

    link.node.href = URL.createObjectURL(file);
    link.node.download = `${fileName}${JSONOptions.Filter}`;
    link.node.click();
  }

  public load(): void {
    this.fileReader.showDialog(JSONOptions.Filter);
  }
}
