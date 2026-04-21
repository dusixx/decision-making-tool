import type { Button, div, input, Wheel } from '@components';
import type { ButtonText } from './create-view.constants.ts';

export type ButtonMap = Record<keyof typeof ButtonText, Button>;

export type DecisionPickerView = {
  durationInput: ReturnType<typeof input>;
  pickedOptionInput: ReturnType<typeof input>;
  wrapper: ReturnType<typeof div>;
  buttonsMap: ButtonMap;
  wheel: Wheel;
};
