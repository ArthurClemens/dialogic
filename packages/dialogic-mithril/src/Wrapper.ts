import m, { Component } from 'mithril';
import { filterCandidates, selectors, Dialogic } from 'dialogic';
import {
  onInstanceMounted,
  onShowInstance,
  onHideInstance,
} from './instanceEvents';
import { Instance } from './Instance';

interface Wrapper extends Dialogic.DialogicalWrapperOptions {}

export const Wrapper: Component<Dialogic.DialogicalWrapperOptions> = {
  view: ({ attrs }) => {
    const nsOnInstanceMounted = onInstanceMounted(attrs.ns);
    const nsOnShowInstance = onShowInstance(attrs.ns);
    const nsOnHideInstance = onHideInstance(attrs.ns);

    const identityOptions: Dialogic.IdentityOptions =
      attrs.identityOptions || ({} as Dialogic.IdentityOptions);
    const filtered = filterCandidates(
      attrs.ns,
      selectors.getStore(),
      identityOptions,
    );

    return filtered.map(item =>
      m(Instance, {
        key: item.key,
        identityOptions: item.identityOptions,
        dialogicOptions: item.dialogicOptions as Dialogic.DialogicOptions<
          Dialogic.PassThroughOptions
        >,
        passThroughOptions: item.passThroughOptions as Dialogic.PassThroughOptions,
        onMount: nsOnInstanceMounted,
        onShow: nsOnShowInstance,
        onHide: nsOnHideInstance,
      }),
    );
  },
};
