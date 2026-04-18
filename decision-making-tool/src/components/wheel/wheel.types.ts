import type { OptionData } from '@components';

export type SliceData = OptionData & {
  startAngleRad: number;
  endAngleRad: number;
  color: string;
  shortenedTitle: string;
};

export type Point = { x: number; y: number };

export type OnSlideChangeHandler = ((currentSlice: SliceData | null) => void) | null;
