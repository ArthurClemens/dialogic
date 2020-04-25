import { states, Dialogic } from 'dialogic';
import { useStream } from 'use-stream';

export type UseDialogicState = () => [Dialogic.NamespaceStore];

type TModel = {
  states: Dialogic.States;
};

export const useDialogicState: UseDialogicState = () => {
  // Subscribe to changes
  const model = useStream<TModel>({
    model: () => ({
      states,
    }),
    defer: true,
  });
  return model ? [model.states().store] : [{}];
};
