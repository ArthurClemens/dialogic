import { RouteResolver, ComponentTypes } from 'mithril';

export type RouteEntry = {
  path: string;
  component: ComponentTypes<any, any> | RouteResolver<any, any>;
  showInMenu?: boolean;
};
