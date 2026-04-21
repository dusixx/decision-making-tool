import { PI2 } from '@/common/constants.ts';
import { getRndColorMixCss, randomizeArray, rndInt } from '@/common/index.ts';
import type { OptionData } from '../option-list/option-list.types.ts';
import { CURSOR_POSITION_RAD, WheelSpin } from './wheel.constants.ts';
import type { SliceData } from './wheel.types.ts';

export const createSlicesFromOptions = (
  options: OptionData[],
  totalWeight: number
): SliceData[] => {
  let startAngleRad: number = 0;
  const slices: SliceData[] = [];
  const randomizedOptions = randomizeArray<OptionData>(options);

  for (const item of randomizedOptions) {
    const itemAngleRad = PI2 * (item.weight / totalWeight);
    const endAngleRad = startAngleRad + itemAngleRad;

    const slice = {
      ...item,
      startAngleRad,
      endAngleRad,
      shortenedTitle: '',
      color: getRndColorMixCss(),
    };
    slices.push(slice);

    startAngleRad = endAngleRad;
  }
  return slices;
};

export function easeOutCubic(x: number): number {
  return 1 - Math.pow(1 - x, 3);
}

export const getRndWheelSpeed = (
  min: number = WheelSpin.MinSpeed,
  max: number = WheelSpin.MaxSpeed
): number => {
  return rndInt(min, max) / WheelSpin.SpeedRatio;
};

export const isCurrentSlice = (slice: SliceData): boolean => {
  let { startAngleRad: start, endAngleRad: end } = slice;

  if (end > PI2 && start > CURSOR_POSITION_RAD) {
    start -= PI2;
    end -= PI2;
  }
  return CURSOR_POSITION_RAD <= end && CURSOR_POSITION_RAD >= start;
};

export const updateSliceAngles = (slice: SliceData, startAngleRad: number): void => {
  let { startAngleRad: start, endAngleRad: end } = slice;
  const angleSize = end - start;

  start = startAngleRad % PI2;
  end = (startAngleRad + angleSize) % PI2;
  if (end < start) {
    end += PI2;
  }
  slice.startAngleRad = start;
  slice.endAngleRad = end;
};
