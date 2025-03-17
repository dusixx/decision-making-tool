import { Element } from '../../components/base/element.ts';

import styles from './header.module.scss';
import { Logo } from './logo.ts';

export class HeaderSection extends Element {
  constructor() {
    super({ tag: 'header' });

    const wrapper = new Element<HTMLDivElement>(
      { tag: 'div', className: styles.wrapper },
      new Logo()
    );

    this.append(wrapper);
  }
}
