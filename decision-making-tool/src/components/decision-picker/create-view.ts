import { Icon } from '@common';
import { Button, div, input, label, OptionList, Wheel } from '@components';
import {
  parseOptionsData,
  VALID_OPTIONS_COUNT,
} from '@components/option-list-section/option-list-section.utils.ts';
import { SoundToggler } from './utils/sound-toggler.ts';

import styles from './decision-picker.module.scss';

export type DecisionPickerSectionButtonsMap = Record<keyof typeof buttonsData, Button>;

const INVITATION_MESSAGE = 'Press start button';

const ERR_INVALID_OPTIONS_COUNT = `
  There must be at least ${VALID_OPTIONS_COUNT.toString()} valid options`;

const buttonsData: Record<string, string> = {
  back: `${Icon.LeftArrow} back`,
  sound: 'sound',
  repaint: Icon.Palette,
  start: `${Icon.Rocket} start`,
};

const DURATION_ID = 'duration-id';
const DEFAULT_DURATION = '10';
const MIN_DURATION = '5';
const MAX_DURATION = '30';

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
    title: 'duration',
    className: styles.duration,
    id: DURATION_ID,
    min: MIN_DURATION,
    max: MAX_DURATION,
    value: DEFAULT_DURATION,
    required: true,
  });

  durationWrapper.append(_label, durationInput);

  return { durationWrapper, durationInput };
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
  buttonsMap: DecisionPickerSectionButtonsMap;
  buttonsWrapper: ReturnType<typeof div>;
} => {
  const buttonsMap: DecisionPickerSectionButtonsMap = {};

  const buttons = Object.entries(buttonsData).map(([name, text]) => {
    const button =
      text === buttonsData.sound ? new SoundToggler() : new Button({ className: styles.btn, text });

    if (button.text === buttonsData.start) {
      button.toggleClass(styles.startBtn);
    } else if (button.text === buttonsData.repaint) {
      button.toggleClass(styles.repaintBtn);
    }
    buttonsMap[name] = button;

    return button;
  });

  const buttonsWrapper = div({ className: styles.btns }, ...buttons);

  return { buttonsMap, buttonsWrapper };
};

export const createView = (): {
  durationInput: ReturnType<typeof input>;
  pickedOptionInput: ReturnType<typeof input>;
  wrapper: ReturnType<typeof div>;
  buttonsMap: DecisionPickerSectionButtonsMap;
  wheel: Wheel;
} => {
  const wheel = createWheel();
  const { durationWrapper, durationInput } = createDurationElement();
  const pickedOptionInput = createPickedOptionElement();
  const inputsWrapper = div({ className: styles.inputs }, durationWrapper, pickedOptionInput);
  const { buttonsMap, buttonsWrapper } = createButtonsWrapper();
  const wrapper = div({ className: styles.wrapper }, buttonsWrapper, inputsWrapper, wheel);

  return { durationInput, pickedOptionInput, wheel, wrapper, buttonsMap };
};
