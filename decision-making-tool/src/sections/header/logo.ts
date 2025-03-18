import { Element } from '../../components/base/element.ts';
import { Icons } from '../../constants/icons.ts';
import { getRndColorMixCss } from '../../utils/color.ts';

import styles from './header.module.scss';

const LOGO_TEXT = `Dmt${Icons.FourLeafClover}!@#$`;
const BASE_COLOR = '#ff43f7';

export class Logo extends Element<HTMLDivElement> {
  constructor() {
    super({ tag: 'div', className: styles.logo });

    const letters = [...LOGO_TEXT].map((text) => {
      const span = new Element<HTMLSpanElement>({ tag: 'span', text });
      span.node.style.color = getRndColorMixCss({ baseColor: BASE_COLOR });

      return span;
    });

    this.append(...letters);
  }
}
