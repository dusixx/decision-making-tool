import { rndInt } from '../../utils/misc.ts';
import { isValidWeight } from '../option-list/helpers.ts';
import type { OptionData } from '../option-list/option-list.ts';

type ParseResult = {
  isValid: boolean;
  totalWeight: number;
};

export const VALID_ITEMS_COUNT = 2;

export const parseOptionsData = (options: OptionData[]): ParseResult => {
  const result: ParseResult = {
    isValid: false,
    totalWeight: 0,
  };
  let validsCount = 0;

  for (const { weight } of options) {
    if (isValidWeight(weight)) {
      result.totalWeight += Number(weight);
      validsCount += 1;
    }
  }
  result.isValid = validsCount >= VALID_ITEMS_COUNT;

  return result;
};

const WHEEL_SPIN_SPEED_MIN = 20;
const WHEEL_SPIN_SPEED_MAX = 30;

export const getRndWheelSpeed = (
  min: number = WHEEL_SPIN_SPEED_MIN,
  max: number = WHEEL_SPIN_SPEED_MAX
): number => {
  return rndInt(min, max) / 1e5;
};
