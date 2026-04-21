import { OptionList } from '@components';
import { isValidWeight } from '@components/option-list/option-list.utils.ts';
import type { OptionData } from '../option-list/option-list.types.ts';
import { VALID_OPTIONS_COUNT } from './option-list-section.constants.ts';

export type ParseResult = {
  isValid: boolean;
  totalWeight: number;
  validOptions: OptionData[];
};

export const parseOptionsData = (options: OptionData[]): ParseResult => {
  const result: ParseResult = {
    isValid: false,
    totalWeight: 0,
    validOptions: [],
  };
  let validCount = 0;

  for (const option of options) {
    option.title = option.title.trim();

    if (option.title && isValidWeight(option.weight)) {
      result.totalWeight += option.weight;
      result.validOptions.push(option);
      validCount += 1;
    }
  }
  result.isValid = validCount >= VALID_OPTIONS_COUNT;

  return result;
};

export const isOptionsDataValid = (): boolean => {
  const listData = OptionList.getFromLocalStorage();
  return Boolean(listData && parseOptionsData(listData.list).isValid);
};
