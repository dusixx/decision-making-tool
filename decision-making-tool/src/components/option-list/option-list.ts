import { JSONParse } from '../../utils/index.ts';
import { Element } from '../base/index.ts';
import { fileService } from '../file-service/file-service.ts';
import { Option } from '../option/option.ts';
import {
  getPressedDeleteButtonId,
  isLikeListData,
  isValidWeight,
  normalizeCSV,
} from './helpers.ts';

import styles from './option-list.module.scss';

const LS_KEY_LIST = 'dmt-0fef90dd-list';
const FILE_PREFIX = 'option-list';
const RE_CSV_LINE = /^(.*),([^,]*)$/;

export type OptionData = { id: number; title: string; weight: string };

export type ListData = {
  list: OptionData[];
  lastId: number;
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

  public add(title: string = '', weight: string = ''): Option {
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
    console.log(this.optionsMap);
    localStorage.setItem(LS_KEY_LIST, data);
  }

  public restoreFromLocalStorage(): void {
    const data = localStorage.getItem(LS_KEY_LIST);
    console.log('from LS:', data);
    this.restoreFromJSON(data ?? '');
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

      if (!isValidWeight(weight)) {
        return null;
      }
      return this.add(title, weight);
    });

    this.append(...options);
  }

  private createOption = ({ id, title, weight }: OptionData): Option => {
    const option = new Option(id);

    option.title = title;
    option.weight = weight;
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

export const optionList = new OptionList();
