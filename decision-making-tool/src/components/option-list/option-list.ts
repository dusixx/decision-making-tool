import { JSONParse } from '../../utils/index.ts';
import { Element } from '../base/index.ts';
import { FileService } from '../file-service/file-service.ts';
import { Option } from '../option/option.ts';

import {
  getPressedDeleteButtonId,
  isLikeListData,
  isValidWeight,
  normalizeCSV,
} from './helpers.ts';

import styles from './option-list.module.scss';

export const LS_KEY_LIST = 'dmt-0fef90dd-list';
const FILE_PREFIX = 'option-list';
const RE_CSV_LINE = /^(.*),([^,]*)$/;

export type OptionData = {
  id: number;
  title: string;
  weight: number;
};

export type ListData = {
  list: OptionData[];
  lastId: number;
};

const fileService = FileService.instance;

//
//-----------------------------
// OptionList
//-----------------------------
//

export class OptionList extends Element<HTMLUListElement> {
  private lastId = 1;
  private optionsMap: Map<number, Option> = new Map();

  constructor() {
    super({ tag: 'ul', className: styles.list });
    this.addInteractivity();
  }

  public static getFromLocalStorage = (): ListData | null => {
    const txt = localStorage.getItem(LS_KEY_LIST);
    const data = JSONParse(txt ?? '');

    return isLikeListData(data) ? data : null;
  };

  public add(title: string = '', weight: number = 0): Option {
    const option = this.createOption({ id: this.lastId, title, weight });

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
    fileService.saveText(this.serialize(), `${FILE_PREFIX}-${Date.now().toString()}`);
  }

  public saveToLocalStorage(): void {
    const data = this.serialize();
    localStorage.setItem(LS_KEY_LIST, data);
  }

  public restoreFromLocalStorage(): boolean {
    const data = localStorage.getItem(LS_KEY_LIST);
    this.restoreFromJSON(data ?? '');

    return Boolean(data);
  }

  public restoreFromJSON(txt: string): void {
    const data = JSONParse(txt);
    if (!isLikeListData(data)) {
      return;
    }
    this.restore(data);
  }

  public parseCSV(txt: string): void {
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

      if (!weight || isValidWeight(weight)) {
        return this.add(title, Number(weight));
      }
      return null;
    });

    this.append(...options);
  }

  public getOptionsData(): OptionData[] {
    return [...this.optionsMap].map(([id, { title, weight }]) => {
      const weightNumber = isValidWeight(weight) ? Number(weight) : 0;

      return { id, title, weight: weightNumber };
    });
  }

  private createOption = ({ id, title, weight }: OptionData): Option => {
    const option = new Option(id);

    option.title = title;
    option.weight = isValidWeight(weight) ? weight.toString() : '';
    this.optionsMap.set(id, option);

    return option;
  };

  private restore(data: ListData): void {
    this.clear();

    const { lastId, list } = data;
    this.lastId = lastId;

    const options = list.map(this.createOption);
    this.append(...options);
  }

  private serialize(): string {
    return JSON.stringify({
      list: this.getOptionsData(),
      lastId: this.lastId,
    });
  }

  private addInteractivity(): void {
    this.addListener('click', (event) => {
      const id = getPressedDeleteButtonId(event);
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
