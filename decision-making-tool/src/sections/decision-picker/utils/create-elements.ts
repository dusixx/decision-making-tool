import { Button } from '../../../components/base/button.ts';
import { div, input, label } from '../../../components/base/tags.ts';
import { OptionList } from '../../../components/option-list/option-list.ts';
import { Wheel } from '../../../components/wheel/wheel.ts';
import { Icon } from '../../../constants/index.ts';
import { parseOptionsData, VALID_OPTIONS_COUNT } from '../../option-list/utils/misc.ts';
import { SoundToggler } from './sound-toggler.ts';

import styles from '../decision-picker.module.scss';

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

enum DurationOptions {
  InputId = 'duration-id',
  DefaultValue = '10',
  MinValue = '5',
  MaxValue = '30',
}

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
  _label.node.htmlFor = DurationOptions.InputId;

  const durationInput = input({
    type: 'number',
    title: 'duration',
    className: styles.duration,
    id: DurationOptions.InputId,
    min: DurationOptions.MinValue,
    max: DurationOptions.MaxValue,
    value: DurationOptions.DefaultValue,
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

export const createElements = (): {
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
