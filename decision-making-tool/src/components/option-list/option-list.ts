import { JSONParse } from '../../utils/index.ts';
import { Element } from '../base/index.ts';
import { getFileService } from '../file-service/file-service.ts';
import { Option } from '../option/option.ts';
import { getPushedDeleteButtonId, isLikeListData } from './helpers.ts';

import styles from './option-list.module.scss';

const LS_KEY_LIST = 'dmt-0fef90dd-list';
const FILE_PREFIX = 'option-list';
const RE_EMPTY_LINES = /^(?:[\t ]*(?:\r?\n|\r))+/;
const RE_EOL = /\r?\n|\r/;
const RE_CSV_LINE = /^(.*),([^,]*)$/;

type OptionData = { id: number; title: string; weight: string };

export type ListData = {
  list: OptionData[];
  lastId: number;
};

const normalizeCSV = (txt: string): string[] | null => {
  const lines = txt
    .replace(RE_EMPTY_LINES, '')
    .split(RE_EOL)
    .filter((line) => line.includes(','));

  return lines.length ? lines : null;
};

//
// OptionList
//

class OptionList extends Element<HTMLUListElement> {
  private lastId = 1;
  private optionsMap: Map<number, Option> = new Map();

  constructor() {
    super({ tag: 'ul', className: styles.list });
    this.addInteractivity();
  }

  public add(): Option {
    const option = new Option(this.lastId);

    this.optionsMap.set(option.id, option);
    this.append(option);

    this.lastId += 1;

    return option;
  }

  public delete(id: number): void {
    const option = this.getItemById(id);
    if (!option) {
      return;
    }
    this.removeChildByRef(option);
    this.optionsMap.delete(id);
    option.remove();

    if (this.optionsMap.size === 0) {
      this.lastId = 1;
    }
  }

  public clear(): void {
    this.optionsMap.clear();
    this.removeChildren();
    this.lastId = 1;
  }

  public saveToFile(): void {
    getFileService().saveText(this.serialize(), `${FILE_PREFIX}-${Date.now().toString()}`);
  }

  public saveToLocalStorage(): void {
    localStorage.setItem(LS_KEY_LIST, this.serialize());
  }

  public restoreFromLocalStorage(): void {
    const data = localStorage.getItem(LS_KEY_LIST);
    this.restoreFromJSON(data ?? '');
  }

  public restoreFromJSON(txt: string): void {
    const data = JSONParse(txt);
    if (!isLikeListData(data)) {
      return;
    }
    this.restore(data);
  }

  public parseFromCSV(txt: string): void {
    const lines = normalizeCSV(txt);
    if (!lines) {
      return;
    }
    const options = lines.map((line) => {
      const match = line.match(RE_CSV_LINE);
      if (!match) {
        return null;
      }
      const [, title, weight] = match;
      const option = this.add();

      option.title = title;
      option.weight = weight;

      return option;
    });

    this.append(...options);
  }

  private restore(data: ListData): void {
    const { lastId, list } = data;
    this.lastId = lastId;

    this.clear();

    const options = list.map(({ id, title, weight }) => {
      const option = new Option(id);

      option.title = title;
      option.weight = weight;
      this.optionsMap.set(id, option);

      return option;
    });

    this.append(...options);
  }

  private serialize(): string {
    const list: OptionData[] = [...this.optionsMap].map(([id, { title, weight }]) => {
      return { id, title, weight };
    });

    return JSON.stringify({
      list,
      lastId: this.lastId,
    });
  }

  private addInteractivity(): void {
    this.addListener('click', (event) => {
      const id = getPushedDeleteButtonId(event);
      if (id != null) {
        this.delete(Number(id));
      }
    });
  }

  private getItemById(id: number): Element<HTMLLIElement> | undefined {
    if (this.optionsMap.has(id)) {
      return this.optionsMap.get(id);
    }
  }
}

const instance = new OptionList();

export const getOptionList = (): OptionList => instance;
