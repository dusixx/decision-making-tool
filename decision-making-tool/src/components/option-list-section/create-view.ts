import { Icon } from '@common';
import { Button, div } from '@components';
import styles from './option-list-section.module.scss';

const buttonsData: Record<string, string> = {
  add: 'add item',
  paste: 'paste list',
  clear: 'clear list',
  save: 'save to file',
  load: 'load from file',
  start: `${Icon.Rocket} start`,
};

export type OptionListSectionButtonsMap = Record<keyof typeof buttonsData, Button>;

const createButtonsWrapper = (): {
  buttonsMap: OptionListSectionButtonsMap;
  buttonsWrapper: ReturnType<typeof div>;
} => {
  const buttonsMap: OptionListSectionButtonsMap = {};

  const buttons = Object.entries(buttonsData).map(([name, text]) => {
    const button = new Button({ className: styles.btn, text });

    if (button.text === buttonsData.start) {
      button.toggleClass(styles.startBtn);
    }
    buttonsMap[name] = button;

    return button;
  });

  const buttonsWrapper = div({ className: styles.btns }, ...buttons);

  return { buttonsMap, buttonsWrapper };
};

export const createView = (): {
  buttonsMap: OptionListSectionButtonsMap;
  wrapper: ReturnType<typeof div>;
} => {
  const { buttonsWrapper, buttonsMap } = createButtonsWrapper();

  const wrapper = div({ className: styles.wrapper }, buttonsWrapper);

  return { buttonsMap, wrapper };
};
