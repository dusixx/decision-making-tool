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

export function saveToJSONFile(content: string, fileName: string): void {
  const link = document.createElement('a');
  const file = new Blob([content], { type: 'text/plain' });

  link.href = URL.createObjectURL(file);
  link.download = `${fileName}.json`;
  link.click();
}
