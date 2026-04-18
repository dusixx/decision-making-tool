import { Element } from '@components';
import { createView } from './create-view.ts';

import styles from './option.module.scss';

export class Option extends Element<HTMLLIElement> {
  private titleRef: Element<HTMLInputElement>;
  private weightRef: Element<HTMLInputElement>;

  constructor(public id: number) {
    super({ tag: 'li', className: styles.option });

    const { label, title, weight, button } = createView(id);
    this.titleRef = title;
    this.weightRef = weight;

    this.append(label, title, weight, button);

    this.titleRef.addListener('focus', () => {
      this.titleRef.node.select();
    });
    this.weightRef.addListener('focus', () => {
      this.weightRef.node.select();
    });
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
