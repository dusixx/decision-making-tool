import { Icon, getRndColorMixCss } from '@common';
import { Element, span } from '@components';
import styles from './header.module.scss';

const LOGO_TEXT = `Make#ur${Icon.Pull8Ball}Decision`;
const BASE_COLOR = '#ff33f7';

export class Logo extends Element<HTMLDivElement> {
  constructor() {
    super({ tag: 'div', className: styles.logo });

    const letters = [...LOGO_TEXT].map((text) => {
      const _span = span({ text });
      const { style } = _span.node;
      style.color = getRndColorMixCss({ baseColor: BASE_COLOR, percent: 55 });

      return _span;
    });

    this.append(...letters);
  }
}
