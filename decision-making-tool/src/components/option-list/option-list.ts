import { Element } from '../base/index.ts';
import { Option } from '../option/option.ts';
import { getPushedDeleteButtonId } from './helpers.ts';

import styles from './option-list.module.scss';

//
// OptionList
//

export class OptionList extends Element<HTMLUListElement> {
  private lastId = 1;
  private optionsMap: Map<number, Element<HTMLLIElement>> = new Map();

  constructor() {
    super({ tag: 'ul', className: styles.list });
    this.addInteractivity();
  }

  public add(): void {
    const option = new Option(this.lastId);

    this.optionsMap.set(option.id, option);
    this.append(option);

    this.lastId += 1;
  }

  public delete(id: number): void {
    const option = this.getItemById(id);
    if (!option) {
      return;
    }
    this.removeChildByRef(option);
    this.optionsMap.delete(id);
    option.remove();

    if (this.optionsMap.size === 0) {
      this.lastId = 1;
    }
  }

  public clear(): void {
    this.optionsMap.clear();
    this.removeChildren();
    this.lastId = 1;
  }

  private addInteractivity(): void {
    this.addListener('click', (event) => {
      const id = getPushedDeleteButtonId(event);
      if (id != null) {
        this.delete(Number(id));
      }
    });
  }

  private getItemById(id: number): Element<HTMLLIElement> | undefined {
    if (this.optionsMap.has(id)) {
      return this.optionsMap.get(id);
    }
  }
}
