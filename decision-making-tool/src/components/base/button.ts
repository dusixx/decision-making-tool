import type { BaseElement, BaseElementProps } from './base-element.js';
import { Element } from './element.js';

type EventHandler = ((event: Event) => void) | null;

type Props = Pick<BaseElementProps, 'className' | 'text'>;

//
// Button
//

export class Button extends Element {
  private _onClick: EventHandler = null;

  constructor({ className, text }: Props, ...children: BaseElement[]) {
    super({ tag: 'button', className, text }, ...children);

    this.addListener('click', (event: Event) => this._onClick?.(event));
  }

  public get onClick(): EventHandler {
    return this._onClick;
  }

  public get disabled(): boolean {
    return this.node instanceof HTMLButtonElement && this.node.disabled;
  }

  public set onClick(handler: EventHandler) {
    this._onClick = handler;
  }

  public set disabled(flag: boolean) {
    if (this.node instanceof HTMLButtonElement) {
      this.node.disabled = flag;
    }
  }
}
