import type { BaseElement } from '../base/index.js';
import { Button, Element } from '../base/index.js';
import { scrollLock } from './scroll-lock.js';

import styles from './modal.module.scss';

type OnCloseHandler = ((result: 'confirmed' | 'cancelled') => void) | null;

enum ButtonText {
  Ok = 'ok',
  Cancel = 'cancel',
}

class Modal extends Element<HTMLDivElement> {
  private _content;
  private okBtn;
  private cancelBtn;
  private _onClose: OnCloseHandler = null;

  constructor() {
    super({ className: styles.backdrop });

    this._content = new Element<HTMLDivElement>({ tag: 'div', className: styles.content });
    this.okBtn = new Button({ className: styles.btn, text: ButtonText.Ok });
    this.cancelBtn = new Button({ className: styles.btn, text: ButtonText.Cancel });

    const buttons = new Element<HTMLDivElement>(
      { tag: 'div', className: styles.buttons },
      this.cancelBtn,
      this.okBtn
    );

    this.append(
      new Element<HTMLDivElement>({ tag: 'div', className: styles.modal }, this._content, buttons)
    );
    this.addInteractivity();
  }

  public get content(): Element<HTMLDivElement> {
    return this._content;
  }

  public get showCancelButton(): boolean {
    return /none/i.test(this.cancelBtn.node.style.display);
  }

  public set showCancelButton(flag: boolean) {
    this.cancelBtn.node.style.display = flag ? '' : 'none';
  }

  public set onClose(handler: OnCloseHandler) {
    this._onClose = handler;
  }

  public override show(...children: BaseElement[]): void {
    this.content.removeChildren();
    this.content.append(...children);

    this.toggle(true);
  }

  private handleClick = ({ target, currentTarget }: Event): void => {
    if (target !== currentTarget && target !== this.okBtn.node && target !== this.cancelBtn.node) {
      return;
    }
    this.toggle(false);
    this._onClose?.(target === this.okBtn.node ? 'confirmed' : 'cancelled');
  };

  private addInteractivity(): void {
    this.addListener('click', this.handleClick);
  }

  private handleKeydown = ({ key, ctrlKey, altKey, shiftKey }: KeyboardEvent): void => {
    if (key === 'Escape' && !ctrlKey && !altKey && !shiftKey) {
      this.toggle(false);
    }
  };

  private toggle(force: boolean): boolean {
    const wasShown = this.toggleClass(styles.active, force);

    scrollLock.toggle(wasShown);

    if (wasShown) {
      document.addEventListener('keydown', this.handleKeydown, {
        once: true,
      });
    } else {
      document.removeEventListener('keydown', this.handleKeydown);
    }
    return wasShown;
  }
}

const instance = new Modal();

export const getModal = (): Modal => instance;
