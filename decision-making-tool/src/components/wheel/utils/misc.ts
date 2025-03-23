import { getRndColorMixCss } from '../../../utils/color.ts';
import { randomizeArray, rndInt } from '../../../utils/misc.ts';
import type { OptionData } from '../../option-list/option-list.ts';
import type { SliceData } from '../types.ts';

export const PI2 = Math.PI * 2;
const CURSOR_POSITION_RAD = Math.PI * 1.5;

enum WheelSpin {
  MinSpeed = 35,
  MaxSpeed = 45,
  SpeedRatio = 1e5,
}

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

export const updateSliceAngles = (slice: SliceData, angleDeltaRad: number): void => {
  let { startAngleRad: start, endAngleRad: end } = slice;

  start = (start + angleDeltaRad) % PI2;
  end = (end + angleDeltaRad) % PI2;
  if (end < start) {
    end += PI2;
  }
  slice.startAngleRad = start;
  slice.endAngleRad = end;
};
