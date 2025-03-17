import { Element } from '../base/element';
import { createOption } from './create-option.ts';

import styles from './option.module.scss';

//
//-----------------------------
// Option
//-----------------------------
//

export class Option extends Element<HTMLLIElement> {
  private optionId: number;
  private titleRef: Element<HTMLInputElement>;
  private weightRef: Element<HTMLInputElement>;

  constructor(id: number) {
    super({ tag: 'li', className: styles.option });

    const { label, title, weight, button } = createOption(id);

    this.optionId = id;
    this.titleRef = title;
    this.weightRef = weight;

    this.append(label, title, weight, button);
  }

  public get id(): number {
    return this.optionId;
  }

  public get title(): string {
    return this.titleRef.node.value;
  }

  public get weight(): string {
    return this.weightRef.node.value;
  }

  public set title(v: string) {
    this.titleRef.node.value = v;
  }

  public set weight(v: string) {
    this.weightRef.node.value = v;
  }
}
