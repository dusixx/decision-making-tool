import { KeyboardEventKey, Visibility, isKeyPressed } from '@common';
import type { Button, div } from '@components';
import { Element, ScrollLock } from '@components';
import { createView } from './create-view/create-view.ts';
import styles from './modal.module.scss';
import type { ModalContent, ModalProps, ModalResult, OnCloseModalHandler } from './modal.types.ts';

const { body } = document;

export class Modal extends Element<HTMLDivElement> {
  private _root: ReturnType<typeof div>;
  private contentRoot: ReturnType<typeof div>;
  private okButton: Button;
  private cancelButton: Button;
  private _onClose: OnCloseModalHandler = null;

  public constructor({ content, showCancelButton = true, onClose = null }: ModalProps) {
    super({ className: styles.backdrop });

    const { contentContainer, okButton, cancelButton, modalRoot } = createView();

    this._root = modalRoot;
    this.contentRoot = contentContainer;
    this.okButton = okButton;
    this.cancelButton = cancelButton;
    this.onClose = onClose;

    this.setContent(content);
    this.showCancelButton(showCancelButton);
    this.append(modalRoot);
    this.init();
  }

  public get root(): ReturnType<typeof div> {
    return this._root;
  }

  public set onClose(handler: OnCloseModalHandler) {
    this._onClose = handler;
  }

  public open(): void {
    this.toggle(true);
  }

  public close(result: ModalResult): void {
    this.toggle(false);
    this._onClose?.(result);
  }

  private setContent(content: ModalContent): void {
    this.contentRoot.removeChildren();
    if (typeof content === 'string') {
      this.contentRoot.node.insertAdjacentHTML('beforeend', content);
    } else {
      this.contentRoot.append(content);
    }
  }

  private showCancelButton(flag: boolean): void {
    this.cancelButton.node.style.display = flag ? '' : Visibility.None;
  }

  private init(): void {
    this.addListener('click', (event) => {
      this.handleBackdropClick(event);
      this.handleButtonClick(event);
    });
  }

  private handleBackdropClick({ target, currentTarget }: Event): void {
    if (target === currentTarget) {
      this.close('cancelled');
    }
  }

  private handleButtonClick = ({ target }: Event): void => {
    if (target instanceof HTMLButtonElement) {
      this._onClose?.(target === this.okButton.node ? 'confirmed' : 'cancelled');
      this.toggle(false);
    }
  };

  private handleDocumentKeydown = (event: KeyboardEvent): void => {
    if (isKeyPressed(KeyboardEventKey.Escape, event)) {
      this.toggle(false);
    }
  };

  private render(flag: boolean): void {
    if (flag) {
      body.append(this.node);
      return;
    }
    this.remove();
  }

  private toggle(force: boolean): boolean {
    const wasShown = this.toggleClass(styles.active, force);
    ScrollLock.toggle(wasShown);

    if (wasShown) {
      document.addEventListener('keydown', this.handleDocumentKeydown);
    } else {
      document.removeEventListener('keydown', this.handleDocumentKeydown);
    }
    this.render(wasShown);

    return wasShown;
  }
}
