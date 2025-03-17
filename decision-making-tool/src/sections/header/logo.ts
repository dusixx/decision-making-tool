import { Element } from '../../components/base/element.ts';
import { getRndColorMixCss } from '../../utils/color.ts';

import styles from './header.module.scss';

const LOGO_TEXT = 'Dmt🍀!@#$';

export class Logo extends Element<HTMLDivElement> {
  constructor() {
    super({ tag: 'div', className: styles.logo });

    const letters = [...LOGO_TEXT].map((text) => {
      const span = new Element<HTMLSpanElement>({ tag: 'span', text });
      span.node.style.color = getRndColorMixCss({ baseColor: '#ff43f7' });

      return span;
    });

    this.append(...letters);
  }
}
