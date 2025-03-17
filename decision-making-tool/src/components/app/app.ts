import { HeaderSection } from '../../sections/header/header.ts';
import { DecisionPickerSection, OptionListSection } from '../../sections/index.ts';
import { NotFoundSection } from '../../sections/not-found/not-found.ts';
import { Element } from '../base/element.ts';
import type { RouteData } from '../router/router.ts';
import { Router } from '../router/router.ts';

export const EVENT_APP_CONTENT_CHANGE = 'appcontentchange';

//
//-----------------------------
// MainSection
//-----------------------------
//

class MainSection extends Element {
  private router: Router;

  constructor() {
    super({ tag: 'main' });

    this.router = new Router(this.createRoutes());
  }

  public setContent(content: Element): void {
    this.removeChildren();
    this.append(content);
  }

  private createRoutes(): RouteData[] {
    return [
      {
        pathname: '/decision-picker',
        callback: (): void => {
          document.dispatchEvent(new Event(EVENT_APP_CONTENT_CHANGE));
          this.setContent(new DecisionPickerSection(this.router));
        },
      },
      {
        pathname: '/',
        callback: (): void => {
          document.dispatchEvent(new Event(EVENT_APP_CONTENT_CHANGE));
          this.setContent(new OptionListSection(this.router));
        },
      },
      {
        pathname: Router.NOT_FOUND_PAGE,
        callback: (): void => {
          this.setContent(new NotFoundSection(this.router));
        },
      },
    ];
  }
}

document.body.append(new HeaderSection().node, new MainSection().node);
