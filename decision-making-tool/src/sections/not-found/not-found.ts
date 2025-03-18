import { Button } from '../../components/base/button.ts';
import { Element } from '../../components/base/element.ts';
import { Endpoint, type Router } from '../../components/router/router.ts';
import { Icons } from '../../constants/icons.ts';

import styles from './not-found.module.scss';

const BUTTON_TEXT = `${Icons.House} go to list`;
const PARA_TEXT = 'page was not found :(';

//
//-----------------------------
// NotFoundSection
//-----------------------------
//

export class NotFoundSection extends Element {
  private button: Button;
  private para: Element<HTMLParagraphElement>;

  constructor(private router: Router) {
    super({ tag: 'section' });

    this.para = new Element<HTMLParagraphElement>({
      tag: 'p',
      text: PARA_TEXT,
      className: styles.para,
    });

    this.button = new Button({ text: BUTTON_TEXT, className: styles.btn });

    const wrapper = new Element<HTMLDivElement>(
      { tag: 'div', className: styles.wrapper },
      this.para,
      this.button
    );

    this.append(wrapper);
    this.addInteractivity();
  }

  private addInteractivity(): void {
    this.button.onClick = (): void => {
      this.router.navigate(Endpoint.OptionList, true);
    };
  }
}
