import { ComponentTypes, RouteResolver } from 'mithril';

export type RouteEntry = {
  path: string;
  component: ComponentTypes<unknown, unknown> | RouteResolver<unknown, unknown>;
  showInMenu?: boolean;
};
