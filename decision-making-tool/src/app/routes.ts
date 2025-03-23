import type { Element } from '../components/base/element.ts';
import type { Router } from '../router/router.ts';
import { DecisionPickerSection, NotFoundSection, OptionListSection } from '../sections/index.ts';

export enum Endpoint {
  OptionList = '/',
  DecisionPicker = '/decision-picker',
  Index = '/index',
  NotFound = '/{404}',
}

export type Route = {
  pathname: string;
  component: (router: Router) => Element;
};

export const routes: Route[] = [
  {
    pathname: Endpoint.DecisionPicker,
    component: (router: Router) => new DecisionPickerSection(router),
  },
  {
    pathname: Endpoint.OptionList,
    component: (router: Router) => new OptionListSection(router),
  },
  {
    pathname: Endpoint.Index,
    component: (router: Router) => new OptionListSection(router),
  },
  {
    pathname: Endpoint.NotFound,
    component: (router: Router) => new NotFoundSection(router),
  },
];
