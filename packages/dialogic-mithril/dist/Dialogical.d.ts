import { Dialogic } from 'dialogic';
import { Component } from 'mithril';

declare type DialogicalFn = (
  type: Dialogic.DialogicInstance,
) => Component<Dialogic.ComponentOptions>;
export declare const Dialogical: DialogicalFn;
export {};
