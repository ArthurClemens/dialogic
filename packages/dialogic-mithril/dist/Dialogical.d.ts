/// <reference types="../../node_modules/@types/mithril" />
import { Dialogic } from 'dialogic';
import { Component } from 'mithril';
type DialogicalFn = (type: Dialogic.DialogicInstance) => Component<Dialogic.ComponentOptions>;
export declare const Dialogical: DialogicalFn;
export {};
