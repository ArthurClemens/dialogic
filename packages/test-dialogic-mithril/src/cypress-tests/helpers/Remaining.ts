import { Dialogic } from 'dialogic';
import { useRemaining } from 'dialogic-mithril';
import m from 'mithril';
import { withHooks } from 'mithril-hooks';

type RemainingProps = {
  instance: Dialogic.DialogicInstance;
  spawn?: string;
  id?: string;
};

const _Remaining = ({ instance, spawn, id }: RemainingProps) => {
  const [displayValue] = useRemaining({
    instance,
    spawn,
    id,
  });

  return m('div', { 'data-test-id': 'remaining' }, [
    m('span', 'Remaining: '),
    m(
      'span[data-test-id=remaining-value]',
      displayValue === undefined ? 'undefined' : displayValue.toString(),
    ),
  ]);
};

export const Remaining = withHooks<RemainingProps>(_Remaining);
