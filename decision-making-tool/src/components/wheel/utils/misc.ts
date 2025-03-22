import { getRndColorMixCss } from '../../../utils/color.ts';
import { randomizeArray, rndInt } from '../../../utils/misc.ts';
import type { OptionData } from '../../option-list/option-list.ts';
import type { SliceData } from '../wheel.ts';

export const PI2 = Math.PI * 2;
const CURSOR_POSITION_RAD = Math.PI * 1.5;

const WHEEL_SPIN_SPEED_MIN = 20;
const WHEEL_SPIN_SPEED_MAX = 35;
const WHEEL_SPIN_SPEED_RATIO = 1e5;

export const createSlicesFromOptions = (
  options: OptionData[],
  totalWeight: number
): SliceData[] => {
  const slices: SliceData[] = [];
  let startAngleRad: number = 0;
  const randomizedOptions = randomizeArray<OptionData>(options);

  for (const item of randomizedOptions) {
    const itemAngleRad = PI2 * (item.weight / totalWeight);
    const endAngleRad = startAngleRad + itemAngleRad;

    const slice = {
      ...item,
      startAngleRad,
      endAngleRad,
      sliceText: '',
      color: getRndColorMixCss(),
    };
    slices.push(slice);

    startAngleRad = endAngleRad;
  }
  return slices;
};

export const getRndWheelSpeed = (
  min: number = WHEEL_SPIN_SPEED_MIN,
  max: number = WHEEL_SPIN_SPEED_MAX
): number => {
  return rndInt(min, max) / WHEEL_SPIN_SPEED_RATIO;
};

export const isCurrentSlice = (slice: SliceData): boolean => {
  return CURSOR_POSITION_RAD <= slice.endAngleRad && CURSOR_POSITION_RAD >= slice.startAngleRad;
};

export const radToDeg = (rad: number): number => rad * (180 / Math.PI);

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
