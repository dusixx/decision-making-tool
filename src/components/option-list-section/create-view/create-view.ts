/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { Button, div } from '@components';
import styles from '../option-list-section.module.scss';
import { ButtonText } from './create-view.constants.ts';

export type ButtonMap = Record<keyof typeof ButtonText, Button>;

const createButtonsWrapper = (): {
  buttonMap: ButtonMap;
  buttonsWrapper: ReturnType<typeof div>;
} => {
  const buttonMap: Record<string, Button> = {};

  const buttons = Object.entries(ButtonText).map(([name, text]) => {
    const button = new Button({ className: styles.btn, text });

    if (text === ButtonText.start) {
      button.toggleClass(styles.startBtn);
    }
    buttonMap[name] = button;

    return button;
  });
  const buttonsWrapper = div({ className: styles.btns }, ...buttons);

  return {
    buttonMap: buttonMap as ButtonMap,
    buttonsWrapper,
  };
};

export const createView = (): {
  buttonMap: ButtonMap;
  wrapper: ReturnType<typeof div>;
} => {
  const { buttonsWrapper, buttonMap } = createButtonsWrapper();
  const wrapper = div({ className: styles.wrapper }, buttonsWrapper);

  return {
    buttonMap,
    wrapper,
  };
};
