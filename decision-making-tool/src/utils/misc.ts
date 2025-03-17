export const genId = (): string => {
  return Math.random().toString(24).slice(2);
};

export const isPositiveInt = (v: number | string): v is number => {
  return Number.isInteger(typeof v === 'number' ? v : parseFloat(v));
};

export const rndInt = (min: number, max: number): number => {
  return Math.round(min + Math.random() * (max - min));
};

export function JSONParse(data: string): unknown {
  try {
    return JSON.parse(data);
  } catch {
    return;
  }
}

export const getRootCSSVariable = (name: string): string => {
  return getComputedStyle(document.documentElement).getPropertyValue(name);
};

export const fitIntoRange = (v: number | string, min: number, max: number): number => {
  if (Number(v) > max) {
    return max;
  }
  if (Number(v) < min) {
    return min;
  }
  return Number(v);
};
