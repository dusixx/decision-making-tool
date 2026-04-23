/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { Icon } from '@common';
import { Button, div, input, label, OptionList, Wheel } from '@components';
import { parseOptionsData } from '@components/option-list-section/option-list-section.utils.ts';
import { SoundToggler } from '../sound-toggler.ts';
import type { ButtonMap, DecisionPickerView } from './create-view.types';

import styles from '../decision-picker.module.scss';
import {
  ButtonText,
  DEFAULT_DURATION,
  DURATION_ID,
  ERR_INVALID_OPTIONS_COUNT,
  INVITATION_MESSAGE,
  MAX_DURATION,
  MIN_DURATION,
} from './create-view.constants.ts';

const createWheel = (): Wheel => {
  const listData = OptionList.getFromLocalStorage();

  if (listData) {
    const parsed = parseOptionsData(listData.list);

    return new Wheel({
      options: parsed.validOptions,
      totalWeight: parsed.totalWeight,
    });
  }
  throw new RangeError(ERR_INVALID_OPTIONS_COUNT);
};

const createDurationElement = (): {
  durationWrapper: ReturnType<typeof div>;
  durationInput: ReturnType<typeof input>;
} => {
  const durationWrapper = div({ className: styles.durationWrapper });

  const _label = label({ className: styles.label });
  _label.text = Icon.Stopwatch;
  _label.node.htmlFor = DURATION_ID;

  const durationInput = input({
    type: 'number',
    title: DURATION_ID,
    className: styles.duration,
    id: DURATION_ID,
    min: MIN_DURATION,
    max: MAX_DURATION,
    value: DEFAULT_DURATION,
    required: true,
  });

  durationWrapper.append(_label, durationInput);

  return {
    durationWrapper,
    durationInput,
  };
};

const createPickedOptionElement = (): ReturnType<typeof input> => {
  return input({
    placeholder: INVITATION_MESSAGE,
    className: styles.pickedOption,
    readOnly: true,
    disabled: true,
  });
};

const createButtonsWrapper = (): {
  buttonsMap: ButtonMap;
  buttonsWrapper: ReturnType<typeof div>;
} => {
  const buttonsMap: Record<string, Button> = {};

  const buttons = Object.entries(ButtonText).map(([name, text]) => {
    const button =
      text === ButtonText.sound ? new SoundToggler() : new Button({ className: styles.btn, text });

    if (text === ButtonText.start) {
      button.toggleClass(styles.startBtn);
    } else if (text === ButtonText.repaint) {
      button.toggleClass(styles.repaintBtn);
    }
    buttonsMap[name] = button;

    return button;
  });

  const buttonsWrapper = div({ className: styles.btns }, ...buttons);

  return {
    buttonsMap: buttonsMap as ButtonMap,
    buttonsWrapper,
  };
};

export const createView = (): DecisionPickerView => {
  const wheel = createWheel();
  const { durationWrapper, durationInput } = createDurationElement();
  const pickedOptionInput = createPickedOptionElement();
  const inputsWrapper = div({ className: styles.inputs }, durationWrapper, pickedOptionInput);
  const { buttonsMap, buttonsWrapper } = createButtonsWrapper();
  const wrapper = div({ className: styles.wrapper }, buttonsWrapper, inputsWrapper, wheel);

  return {
    durationInput,
    pickedOptionInput,
    wheel,
    wrapper,
    buttonsMap,
  };
};
