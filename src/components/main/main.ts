import type { Route } from '@app/routes.ts';
import { Endpoint, routes } from '@app/routes.ts';
import { EventType } from '@common';
import { Element } from '@components';
import { Router } from '@router';
import { isOptionsDataValid } from '../option-list-section/option-list-section.utils.ts';

export class MainSection extends Element {
  private router: Router;

  constructor() {
    super({ tag: 'main' });
    this.router = new Router(routes);
    this.router.subscribe('route-change', this.handleRouteChange);
  }

  public setContent(content: Element): void {
    this.removeChildren();
    this.append(content);
  }

  private handleRouteChange = ({ pathname, component }: Route): void => {
    this.dispatch(EventType.BeforeContentChange);

    if (Router.isPathnamesEqual(pathname, Endpoint.DecisionPicker) && !isOptionsDataValid()) {
      this.router.navigate(Endpoint.OptionList);
      return;
    }
    this.setContent(component(this.router));
  };
}
