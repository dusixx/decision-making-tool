export type BaseElementProps = {
  tag?: keyof HTMLElementTagNameMap;
  className?: string;
  text?: string;
};

//
// BaseElement
//

export class BaseElement {
  private _node: HTMLElement;
  private _children: BaseElement[] = [];

  constructor(props?: BaseElementProps, ...children: BaseElement[]) {
    const { tag = 'div', className, text } = props ?? {};

    this._node = document.createElement(tag);
    if (className) {
      this._node.className = className;
    }
    this._node.textContent = text ?? null;
    this.append(...children);
  }

  public get node(): HTMLElement {
    return this._node;
  }

  public get children(): BaseElement[] {
    return [...this._children];
  }

  public get text(): string {
    return this._node.textContent ?? '';
  }

  public set text(value: string) {
    this._node.textContent = value;
  }

  public append(...children: BaseElement[]): void {
    this._children = [...this._children, ...children];
    this._node.append(...children.map((child) => child.node));
  }

  public setAttribute(attributes: Record<string, string>): void {
    Object.entries(attributes).forEach(([name, value]) => {
      this.node.setAttribute(name, value);
    });
  }

  public removeAttribute(attributes: string | string[]): void {
    const names = Array.isArray(attributes) ? attributes : [attributes];

    names.forEach((name) => {
      this._node.removeAttribute(name);
    });
  }

  public addListener(
    event: keyof HTMLElementEventMap,
    listener: EventListenerOrEventListenerObject,
    options: AddEventListenerOptions | boolean = false
  ): void {
    this.node.addEventListener(event, listener, options);
  }

  public removeListener(
    event: keyof HTMLElementEventMap,
    listener: EventListenerOrEventListenerObject,
    options: AddEventListenerOptions | boolean = false
  ): void {
    this._node.removeEventListener(event, listener, options);
  }

  public toggleClass(name: string, force: boolean): boolean {
    return this.node.classList.toggle(name, force);
  }

  public remove(): void {
    this.removeChildren();
    this._node.remove();
  }

  public removeChildren(): void {
    this._children.forEach((child) => {
      child.remove();
    });
    this._children.length = 0;
  }
}
