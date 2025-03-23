import { Endpoint } from '../../app/routes.ts';
import { Element } from '../../components/base/element.ts';
import { showModalMessage } from '../../components/modal/utils/show-modal-message.ts';
import { OptionList } from '../../components/option-list/option-list.ts';
import { PasteList } from '../../components/paste-list/paste-list.ts';
import { EventType } from '../../constants/index.ts';
import type { Router } from '../../router/router.ts';
import { JSONFileService } from '../../services/json-file-service/json-file-service.ts';
import type { FileData } from '../../services/json-file-service/text-file-reader.ts';
import type { OptionListSectionButtonsMap } from './utils/create-elements.ts';
import { createElements } from './utils/create-elements.ts';
import { parseOptionsData } from './utils/misc.ts';

const ERR_INVALID_OPTIONS_COUNT = `<p style='text-align:center;word-break: normal'>
  Please add at least 2 valid options.
  An option is considered valid if its title is not empty and its weight is greater than 0</p>`;

export class OptionListSection extends Element {
  private fileService: JSONFileService = new JSONFileService();
  private optionList: OptionList = new OptionList();
  private pasteList: PasteList;
  private buttons: OptionListSectionButtonsMap = {};

  constructor(private router: Router) {
    super({ tag: 'section' });

    this.pasteList = new PasteList();
    this.router = router;

    this.optionList.updateFromLocalStorage();
    if (!this.optionList.length) {
      this.optionList.add();
    }

    const { wrapper, buttonsMap } = createElements();
    this.buttons = buttonsMap;
    wrapper.append(this.optionList);

    this.append(wrapper);

    this.init();
  }

  public isOptionsDataValid(): boolean {
    return parseOptionsData(this.optionList.data).isValid;
  }

  private addPasteClickHandler(): void {
    this.buttons.paste.onClick = (): void => {
      this.pasteList.show();
    };
    this.pasteList.onConfirm = (text): void => {
      this.optionList.updateFromCSV(text);
    };
  }

  private addLoadClickHandler(): void {
    this.buttons.load.onClick = (): void => {
      this.fileService.load();
    };
    this.fileService.onLoad = (v: FileData): void => {
      if (typeof v === 'string') {
        this.optionList.updateFromJSON(v);
      }
    };
  }

  private addAddClickHandler(): void {
    this.buttons.add.onClick = (): void => {
      this.optionList.add();
    };
  }

  private addStartClickHandler(): void {
    this.buttons.start.onClick = (): void => {
      if (!this.isOptionsDataValid()) {
        showModalMessage(ERR_INVALID_OPTIONS_COUNT);
        return;
      }
      this.router.navigate(Endpoint.DecisionPicker);
    };
  }

  private addClearClickHandler(): void {
    this.buttons.clear.onClick = (): void => {
      this.optionList.clear();
    };
  }

  private addSaveClickHandler(): void {
    this.buttons.save.onClick = (): void => {
      this.optionList.saveToFile();
    };
  }

  private addBeforeContentChangeHandler(): void {
    document.addEventListener(EventType.BeforeContentChange, () => {
      this.optionList.saveToLocalStorage();
    });
  }

  private addBeforeUnloadHandler(): void {
    window.addEventListener('beforeunload', () => {
      this.optionList.saveToLocalStorage();
    });
  }

  private init(): void {
    this.addBeforeUnloadHandler();
    this.addBeforeContentChangeHandler();
    this.addLoadClickHandler();
    this.addPasteClickHandler();
    this.addStartClickHandler();
    this.addAddClickHandler();
    this.addClearClickHandler();
    this.addSaveClickHandler();
  }
}
