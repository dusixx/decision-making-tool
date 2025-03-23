import { Button, input, label } from '../../../base/index.ts';

import styles from '../option.module.scss';

const TITLE_MAX_LEN = 120;
const TITLE_MIN_LEN = 10;
const WEIGHT_MIN = 0;

const TITLE_PLACEHOLDER = 'title';
const WEIGHT_PLACEHOLDER = 'weight';
const DELETE_BTN_TEXT = '✕';
const DELETE_BTN_TITLE = 'delete';

type OptionElements = {
  label: ReturnType<typeof label>;
  title: ReturnType<typeof input>;
  weight: ReturnType<typeof input>;
  button: Button;
};

export function createElements(id: number): OptionElements {
  const optionId = `option-#${id.toString()}`;

  const _label = label({
    className: styles.label,
    text: `#${id.toString()}`,
    htmlFor: optionId,
  });

  const title = input({
    className: styles.title,
    id: optionId,
    placeholder: TITLE_PLACEHOLDER,
    maxLength: TITLE_MAX_LEN,
    minLength: TITLE_MIN_LEN,
  });

  const weight = input({
    className: styles.weight,
    type: 'number',
    placeholder: WEIGHT_PLACEHOLDER,
    min: WEIGHT_MIN.toString(),
  });

  const button = new Button({
    className: styles.deleteBtn,
    text: DELETE_BTN_TEXT,
    title: DELETE_BTN_TITLE,
  });
  button.node.dataset.delete = id.toString();

  return { label: _label, title, weight, button };
}
