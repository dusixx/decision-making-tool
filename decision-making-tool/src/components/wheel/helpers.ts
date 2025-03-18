import { rndInt } from '../../utils/misc.ts';
import { isValidWeight } from '../option-list/helpers.ts';
import type { OptionData } from '../option-list/option-list.ts';
import { OptionList } from '../option-list/option-list.ts';

export type ParseResult = {
  isValid: boolean;
  totalWeight: number;
  validOptions: OptionData[];
};

export const VALID_ITEMS_COUNT = 2;

export const parseOptionsData = (options: OptionData[]): ParseResult => {
  const result: ParseResult = {
    isValid: false,
    totalWeight: 0,
    validOptions: [],
  };
  let validsCount = 0;

  for (const option of options) {
    if (option.title && isValidWeight(option.weight)) {
      result.totalWeight += Number(option.weight);
      result.validOptions.push(option);
      validsCount += 1;
    }
  }
  result.isValid = validsCount >= VALID_ITEMS_COUNT;

  return result;
};

const WHEEL_SPIN_SPEED_MIN = 20;
const WHEEL_SPIN_SPEED_MAX = 30;
const WHEEL_SPEED_RATIO = 1e5;

export const getRndWheelSpeed = (
  min: number = WHEEL_SPIN_SPEED_MIN,
  max: number = WHEEL_SPIN_SPEED_MAX
): number => {
  return rndInt(min, max) / WHEEL_SPEED_RATIO;
};

export const isOptionsDataValid = (): boolean => {
  const listData = OptionList.getFromLocalStorage();
  return Boolean(listData && parseOptionsData(listData.list).isValid);
};
