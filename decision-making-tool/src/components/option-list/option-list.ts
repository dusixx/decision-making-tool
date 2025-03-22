import { JSONParse } from '../../utils/index.ts';
import { Element } from '../base/index.ts';
import { JSONFileService } from '../json-file-service/json-file-service.ts';
import { Option } from '../option-list/option/option.ts';

import {
  getOptionListFromLocalStorage,
  getPressedDeleteButtonId,
  isLikeListData,
  isValidWeight,
  LS_KEY_LIST,
  normalizeCSV,
} from './utils/misc.ts';

import styles from './option-list.module.scss';

const FILE_PREFIX = 'options';
const FILE_NAME = `${FILE_PREFIX}-dmt-0fef90dd`;
const RE_CSV_LINE = /^(?<title>.*),(?<weight>[^,]*)$/;
const INITIAL_ID = 1;

export type OptionData = {
  id: number;
  title: string;
  weight: number;
};

export type ListData = {
  list: OptionData[];
  lastId: number;
};

export class OptionList extends Element<HTMLUListElement> {
  private lastId = INITIAL_ID;
  private fileService = new JSONFileService();
  private optionsMap: Map<number, Option> = new Map();

  constructor() {
    super({ tag: 'ul', className: styles.list });
    this.init();
  }

  public get data(): OptionData[] {
    return [...this.optionsMap].map(([id, { title, weight }]) => {
      const weightNumber = isValidWeight(weight) ? Number(weight) : 0;

      return { id, title, weight: weightNumber };
    });
  }

  public static getFromLocalStorage = (): ListData | null => {
    return getOptionListFromLocalStorage();
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

    if (this.optionsMap.size === 0) {
      this.lastId = INITIAL_ID;
    }
  }

  public clear(): void {
    this.optionsMap.clear();
    this.removeChildren();
    this.lastId = INITIAL_ID;
  }

  public saveToFile(): void {
    this.fileService.save(this.serialize(), FILE_NAME);
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
      let [, title, weight] = match;

      title = title.trim();
      weight = weight.trim();

      if (!weight || isValidWeight(weight)) {
        return this.add(title, Number(weight));
      }
      return null;
    });

    this.append(...options);
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
      list: this.data,
      lastId: this.lastId,
    });
  }

  private handleOptionListClick(): void {
    this.addListener('click', (event) => {
      const id = getPressedDeleteButtonId(event);
      if (id != null) {
        this.delete(Number(id));
      }
    });
  }

  private init(): void {
    this.handleOptionListClick();
  }

  private getItemById(id: number): Element<HTMLLIElement> | undefined {
    if (this.optionsMap.has(id)) {
      return this.optionsMap.get(id);
    }
  }
}
