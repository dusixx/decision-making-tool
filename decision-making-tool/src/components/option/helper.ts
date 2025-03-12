import { Button, Element } from '../base/index.ts';

import styles from './option.module.scss';

const TITLE_MAX_LEN = 150;
const TITLE_MIN_LEN = 10;
const WEIGHT_MIN = 0;
const TITLE_PLACEHOLDER = 'title';
const WEIGHT_PLACEHOLDER = 'weight';

type ReturnFunctionType = {
  label: Element<HTMLLabelElement>;
  title: Element<HTMLInputElement>;
  weight: Element<HTMLInputElement>;
  button: Button;
};

export function createOption(id: number): ReturnFunctionType {
  const optionId = `option-#${id.toString()}`;

  const label = new Element<HTMLLabelElement>({
    tag: 'label',
    className: styles.label,
    text: `#${id.toString()}`,
    htmlFor: optionId,
  });

  const title = new Element<HTMLInputElement>({
    tag: 'input',
    className: styles.title,
    id: optionId,
    placeholder: TITLE_PLACEHOLDER,
    maxLength: TITLE_MAX_LEN,
    minLength: TITLE_MIN_LEN,
  });

  const weight = new Element<HTMLInputElement>({
    tag: 'input',
    className: styles.weight,
    type: 'number',
    placeholder: WEIGHT_PLACEHOLDER,
    min: WEIGHT_MIN.toString(),
  });

  const button = new Button({ className: styles.btn, text: 'delete' });

  return { label, title, weight, button };
}
