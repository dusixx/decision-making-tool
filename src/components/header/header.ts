import { Element } from '../../components/base/element.ts';
import { div } from '../../components/base/tags.ts';
import styles from './header.module.scss';
import { Logo } from './logo.ts';

export class HeaderSection extends Element {
  constructor() {
    super({ tag: 'header' });
    this.append(div({ className: styles.wrapper }, new Logo()));
  }
}
