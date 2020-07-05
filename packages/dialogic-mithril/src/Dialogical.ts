import m, { Component } from 'mithril';
import { Dialogic } from 'dialogic';
import { Wrapper } from './Wrapper';

type DialogicalFn = (
  type: Dialogic.DialogicInstance,
) => Component<Dialogic.ComponentOptions>;

export const Dialogical: DialogicalFn = type => ({
  oncreate: ({ attrs }) => {
    if (typeof attrs.onMount === 'function') {
      attrs.onMount();
    }
  },
  view: ({ attrs }) => {
    const identityOptions = {
      id: attrs.id || type.defaultId,
      spawn: attrs.spawn || type.defaultSpawn,
    };
    return m(Wrapper, {
      identityOptions,
      ns: type.ns,
    });
  },
});
