import type { OptionData } from '@components';
import { OptionList } from '@components';
import { isValidWeight } from '@components/option-list/option-list.utils.ts';

export type ParseResult = {
  isValid: boolean;
  totalWeight: number;
  validOptions: OptionData[];
};

export const VALID_OPTIONS_COUNT = 2;

export const parseOptionsData = (options: OptionData[]): ParseResult => {
  const result: ParseResult = {
    isValid: false,
    totalWeight: 0,
    validOptions: [],
  };
  let validsCount = 0;

  for (const option of options) {
    option.title = option.title.trim();

    if (option.title && isValidWeight(option.weight)) {
      result.totalWeight += option.weight;
      result.validOptions.push(option);
      validsCount += 1;
    }
  }
  result.isValid = validsCount >= VALID_OPTIONS_COUNT;

  return result;
};

export const isOptionsDataValid = (): boolean => {
  const listData = OptionList.getFromLocalStorage();
  return Boolean(listData && parseOptionsData(listData.list).isValid);
};
