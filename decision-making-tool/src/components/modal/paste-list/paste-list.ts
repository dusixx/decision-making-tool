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
  private textArea: Element<HTMLTextAreaElement>;
  private _onConfirm: OnConfirmHandler = null;

  constructor() {
    this.textArea = new Element<HTMLTextAreaElement>({
      tag: 'textarea',
      className: styles.text,
      placeholder: PLACEHOLDER,
    });
  }

  public set onConfirm(handler: OnConfirmHandler) {
    this._onConfirm = handler;
  }

  public show(): void {
    const modal = new Modal();
    modal.showCancelButton = true;

    this.handleModalClose(modal);
    document.body.append(modal.node);

    this.textArea.node.value = '';
    modal.show(this.textArea);
  }

  private handleModalClose(modal: Modal): void {
    modal.onClose = (result): void => {
      const { value } = this.textArea.node;
      this.textArea.node.value = '';

      if (result === 'confirmed') {
        this._onConfirm?.(value);
      }
      modal.node.remove();
    };
  }
}
