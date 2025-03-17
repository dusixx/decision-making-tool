import type { BaseElementProps } from '../../utils/create-element.js';
import type { BaseElement } from './base-element.js';
import { Element } from './element.js';

type EventHandler = ((event: Event) => void) | null;

//
// Button
//

export class Button extends Element<HTMLButtonElement> {
  private _onClick: EventHandler = null;

  constructor(props: BaseElementProps<HTMLButtonElement>, ...children: BaseElement[]) {
    super({ tag: 'button', type: 'button', ...props }, ...children);

    this.addListener('click', (event: Event) => this._onClick?.(event));
  }

  public get onClick(): EventHandler {
    return this._onClick;
  }

  public get disabled(): boolean {
    return this.node.disabled;
  }

  public set onClick(handler: EventHandler) {
    this._onClick = handler;
  }

  public set disabled(flag: boolean) {
    this.node.disabled = flag;
  }
}
