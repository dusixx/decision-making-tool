import { Element } from '../base/element.ts';

export type FileData = string | ArrayBuffer | null;

export type OnLoadHandler = ((v: FileData) => void) | null;

export type OnErrorHandler = (() => void) | null;

//
//-----------------------------
//  FileLoader
//-----------------------------
//

export class FileLoader extends Element<HTMLInputElement> {
  private static _instance: FileLoader = new FileLoader();
  private _onLoad: OnLoadHandler = null;
  private _onError: OnErrorHandler = null;

  constructor() {
    super({ tag: 'input', type: 'file' });
    this.node.style.display = 'none';
    this.addInteractivity();
  }

  public static get instance(): FileLoader {
    return this._instance;
  }

  public get type(): string {
    return this.node.accept;
  }

  public set onLoad(handler: OnLoadHandler) {
    this._onLoad = handler;
  }

  public set onError(handler: OnErrorHandler) {
    this._onError = handler;
  }

  public set type(v: string) {
    this.node.accept = v;
  }

  public showDialog(): void {
    this.node.click();
  }

  private addInteractivity(): void {
    this.addListener('change', ({ target }) => {
      if (!(target instanceof HTMLInputElement)) {
        return;
      }
      const blob = target.files?.[0];
      if (!blob) {
        return;
      }
      const reader = new FileReader();

      reader.onload = (): void => {
        this._onLoad?.(reader.result);
      };
      reader.onerror = (): void => {
        this._onError?.();
      };
      reader.readAsText(blob);
    });
  }
}
