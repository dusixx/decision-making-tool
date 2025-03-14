import { Element } from '../base/element.ts';
import { modal } from '../modal/modal.ts';

import styles from './paste-list.module.scss';

type OnConfirmHandler = ((txt: string) => void) | null;

const TEXT_AREA_PLACEHOLDER = 'Paste a list of new options in a CSV-like format';

class PasteList {
  private _node = modal.node;
  private textArea: Element<HTMLTextAreaElement>;
  private _onConfirm: OnConfirmHandler = null;

  constructor() {
    this.textArea = new Element<HTMLTextAreaElement>({
      tag: 'textarea',
      className: styles.text,
      placeholder: TEXT_AREA_PLACEHOLDER,
    });
    modal.showCancelButton = true;
    this.addInteractivity();
  }

  public get node(): typeof modal.node {
    return this._node;
  }

  public set onConfirm(handler: OnConfirmHandler) {
    this._onConfirm = handler;
  }

  public show(): void {
    this.textArea.node.value = '';
    modal.show(this.textArea);
  }

  private addInteractivity(): void {
    modal.onClose = (result): void => {
      if (result === 'confirmed') {
        this._onConfirm?.(this.textArea.node.value);
      }
    };
  }
}

export const pasteListModal = new PasteList();
