import { KeyboardEventKey } from '../../constants/index.ts';
import { isKeyPressed } from '../../utils/misc.ts';
import { textArea } from '../base/tags.ts';
import { Modal } from '../modal/modal.ts';

import styles from './paste-list.module.scss';

type OnConfirmHandler = ((txt: string) => void) | null;

const PLACEHOLDER = 'Paste a list of new options in a CSV-like format';

export class PasteList {
  private _textArea: ReturnType<typeof textArea>;
  private _onConfirm: OnConfirmHandler = null;
  private modal: Modal | null = null;

  constructor() {
    this._textArea = textArea({
      className: styles.text,
      placeholder: PLACEHOLDER,
    });
    this.handleTextAreaKeydown();
  }

  public set onConfirm(handler: OnConfirmHandler) {
    this._onConfirm = handler;
  }

  public show(): void {
    this.modal = this.createModal();
    this.modal.open();
  }

  private createModal(): Modal {
    return new Modal({
      content: this._textArea,
      showCancelButton: true,

      onClose: (result): void => {
        const { value } = this._textArea.node;
        this._textArea.node.value = '';

        if (result === 'confirmed') {
          this._onConfirm?.(value);
        }
      },
    });
  }

  private handleTextAreaKeydown(): void {
    this._textArea.addListener('keydown', (event) => {
      if (!(event instanceof KeyboardEvent)) {
        return;
      }
      if (isKeyPressed(KeyboardEventKey.Escape, event)) {
        event.preventDefault();
        this.modal?.close('cancelled');
      }
    });
  }
}
