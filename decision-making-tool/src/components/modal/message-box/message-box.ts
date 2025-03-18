import { Element } from '../../base/element.ts';
import { Modal } from '../modal.ts';

import styles from './message-box.module.scss';

//
//-----------------------------
//  MessageBox
//-----------------------------
//

export class MessageBox {
  private para: Element<HTMLParagraphElement>;

  constructor() {
    this.para = new Element<HTMLParagraphElement>({
      tag: 'p',
      className: styles.para,
    });
  }

  public show(text: string): void {
    const modal = new Modal();

    modal.showCancelButton = false;
    modal.onClose = (): void => {
      modal.node.remove();
    };
    document.body.append(modal.node);
    this.para.node.textContent = text;
    modal.show(this.para);
  }
}
