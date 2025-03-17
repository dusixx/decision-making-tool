import { Element } from '../../base/element.ts';
import { Modal } from '../modal.ts';

import styles from './message-box.module.scss';

//
//-----------------------------
//  MessageBox
//-----------------------------
//

export class MessageBox {
  private modal: Modal;
  private para: Element<HTMLParagraphElement>;

  constructor(modalInstance: Modal = new Modal()) {
    this.modal = modalInstance;

    this.para = new Element<HTMLParagraphElement>({
      tag: 'p',
      className: styles.para,
    });
  }

  public get parentModal(): Modal {
    return this.modal;
  }

  public show(text: string): void {
    this.modal.showCancelButton = false;
    this.para.node.textContent = text;
    this.modal.show(this.para);
  }
}
