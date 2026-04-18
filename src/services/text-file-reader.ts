import { Visibility } from '@common';
import { Element } from '@components';

export type FileData = string | ArrayBuffer | null;

export type OnLoadHandler = ((v: FileData) => void) | null;

export type OnErrorHandler = (() => void) | null;

export class TextFileReader extends Element<HTMLInputElement> {
  private encoding: string = '';
  private _onLoad: OnLoadHandler = null;
  private _onError: OnErrorHandler = null;

  constructor() {
    super({ tag: 'input', type: 'file' });
    this.node.style.display = Visibility.None;
    this.init();
  }

  public set onLoad(handler: OnLoadHandler) {
    this._onLoad = handler;
  }

  public set onError(handler: OnErrorHandler) {
    this._onError = handler;
  }

  public showDialog(filter: string = '', encoding: string = ''): void {
    this.encoding = encoding;
    this.node.accept = filter;
    this.node.click();
  }

  private readTextFile(blob: Blob): void {
    const reader = new FileReader();

    reader.onload = (): void => {
      this._onLoad?.(reader.result);
    };
    reader.onerror = (): void => {
      this._onError?.();
    };
    reader.readAsText(blob, this.encoding);
  }

  private init(): void {
    this.addListener('change', ({ target }) => {
      if (target instanceof HTMLInputElement) {
        const blob = target.files?.[0];
        if (blob) {
          this.readTextFile(blob);
        }
      }
    });
  }
}
