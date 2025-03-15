import { isValidWeight } from '../option-list/helpers.ts';
import type { OptionData } from '../option-list/option-list.ts';

type ParseResult = {
  isValid: boolean;
  totalWeight: number;
};

const VALID_ITEMS_COUNT = 2;

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
