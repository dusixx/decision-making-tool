import { BaseElement } from './base-element';

export class Element<T extends HTMLElement = HTMLElement> extends BaseElement<T> {
  public get visible(): boolean {
    const { style } = this.node;
    return style.visibility === 'visible';
  }

  public set visible(flag: boolean) {
    const { style } = this.node;
    style.visibility = flag ? 'visible' : 'hidden';
    style.pointerEvents = flag ? '' : 'none';
  }

  public dispatch(eventType: string, options: EventInit): boolean {
    return this.node.dispatchEvent(
      new Event(eventType, {
        bubbles: true,
        cancelable: true,
        ...options,
      })
    );
  }

  public dispatchCustom(
    eventType: string,
    detail: Record<string, unknown>,
    options: EventInit
  ): boolean {
    return this.node.dispatchEvent(
      new CustomEvent(eventType, {
        bubbles: true,
        cancelable: true,
        detail: { ...detail, target: this },
        ...options,
      })
    );
  }

  public allowPointerEvents(flag: boolean): void {
    this.node.style.pointerEvents = flag ? '' : 'none';
  }

  public hide(): void {
    this.node.style.display = 'none';
  }

  public show(): void {
    this.node.style.display = '';
  }
}
