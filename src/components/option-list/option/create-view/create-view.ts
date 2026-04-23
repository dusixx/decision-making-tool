import { Button, input, label } from '@components';
import styles from '../option.module.scss';
import {
  DELETE_BTN_TEXT,
  DELETE_BTN_TITLE,
  TITLE_MAX_LEN,
  TITLE_MIN_LEN,
  TITLE_PLACEHOLDER,
  WEIGHT_MIN,
  WEIGHT_PLACEHOLDER,
} from './create-view.constants.ts';

type OptionView = {
  label: ReturnType<typeof label>;
  title: ReturnType<typeof input>;
  weight: ReturnType<typeof input>;
  button: Button;
};

export function createView(id: number): OptionView {
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

  return {
    label: _label,
    title,
    weight,
    button,
  };
}
