import { Dialogic, states } from 'dialogic';
import { useStream } from 'use-stream';

type TModel = {
  _: Dialogic.States;
};

export const useDialogicState = () => {
  // Subscribe to changes
  useStream<TModel>({
    model: () => ({
      _: states,
    }),
    defer: true,
  });
};
