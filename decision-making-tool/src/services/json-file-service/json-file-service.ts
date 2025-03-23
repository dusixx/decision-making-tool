import { anchor } from '../../components/base/tags.ts';
import type { OnErrorHandler, OnLoadHandler } from './text-file-reader.ts';
import { TextFileReader } from './text-file-reader.ts';

const JSON_FILES_FILTER = '.json';
const JSON_MIME_TYPE = 'application/json';

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
    const fileBlob = new Blob([json], { type: JSON_MIME_TYPE });

    link.node.href = URL.createObjectURL(fileBlob);
    link.node.download = `${fileName}${JSON_FILES_FILTER}`;
    link.node.click();
  }

  public load(): void {
    this.fileReader.showDialog(JSON_FILES_FILTER);
  }
}
