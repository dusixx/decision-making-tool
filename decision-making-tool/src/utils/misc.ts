export const genId = (): string => {
  return Math.random().toString(24).slice(2);
};

export function JSONParse(data: string): unknown {
  try {
    return JSON.parse(data);
  } catch {
    return;
  }
}

export const isPositiveInt = (v: number | string): boolean => {
  return Number.isInteger(typeof v === 'number' ? v : parseFloat(v));
};

export const rndInt = (min: number, max: number): number => {
  return Math.round(min + Math.random() * (max - min));
};

type ColorRGBHex = { rgb: number[]; hex: string };

export const getRandomColor = ({ min = 0, max = 255 } = {}): ColorRGBHex => {
  const rgb = [0, 0, 0].map(() => rndInt(min, max));
  const hex = rgb.map((v) => v.toString(16).padStart(2, '0'));

  return {
    rgb,
    hex: `#${hex.join('')}`,
  };
};

export const getColorMixCss = ({
  min = 25,
  max = 30,
  percent = 50,
  baseColor = '#ffcfcf',
} = {}): string => {
  const randomInt = rndInt(min, max).toString();
  const colorHex = getRandomColor().hex;

  return `color-mix(in oklab, ${colorHex} ${randomInt}%, ${baseColor} ${percent.toString()}%)`;
};
