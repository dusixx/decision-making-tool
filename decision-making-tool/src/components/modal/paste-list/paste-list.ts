import { Element } from '../../base/element.ts';
import { Modal } from '../modal.ts';

import styles from './paste-list.module.scss';

type OnConfirmHandler = ((txt: string) => void) | null;

const PLACEHOLDER = 'Paste a list of new options in a CSV-like format';

//
//-----------------------------
// PasteList
//-----------------------------
//

export class PasteList {
  private modal = new Modal();
  private textArea: Element<HTMLTextAreaElement>;
  private _onConfirm: OnConfirmHandler = null;

  constructor() {
    this.textArea = new Element<HTMLTextAreaElement>({
      tag: 'textarea',
      className: styles.text,
      placeholder: PLACEHOLDER,
    });
    this.addInteractivity();
  }

  public get parentModal(): Modal {
    return this.modal;
  }

  public set onConfirm(handler: OnConfirmHandler) {
    this._onConfirm = handler;
  }

  public show(): void {
    this.modal.showCancelButton = true;
    this.textArea.node.value = '';
    this.modal.show(this.textArea);
  }

  private addInteractivity(): void {
    this.modal.onClose = (result): void => {
      const { value } = this.textArea.node;
      this.textArea.node.value = '';

      if (result === 'confirmed') {
        this._onConfirm?.(value);
      }
    };
  }
}
