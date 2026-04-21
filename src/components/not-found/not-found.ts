import { Endpoint } from '@app/routes.ts';
import { Icon } from '@common';
import { Button, Element, div, paragraph } from '@components';
import { type Router } from '@router';
import styles from './not-found.module.scss';

const BUTTON_TEXT = `${Icon.House} go to list`;
const NOT_FOUND_TEXT = 'page was not found :(';

export class NotFoundSection extends Element {
  private button: Button;
  private notFoundText: ReturnType<typeof paragraph>;

  constructor(private router: Router) {
    super({ tag: 'section' });

    this.notFoundText = paragraph({
      text: NOT_FOUND_TEXT,
      className: styles.para,
    });
    this.button = new Button({ text: BUTTON_TEXT, className: styles.btn });
    const wrapper = div({ className: styles.wrapper }, this.notFoundText, this.button);

    this.button.onClick = (): void => {
      this.router.navigate(Endpoint.OptionList, true);
    };
    this.append(wrapper);
  }
}
