import { states, Dialogic } from 'dialogic';
import { useStream } from 'use-stream';
import { UseDialogicState } from '../index.d';

type TModel = {
  _: Dialogic.States;
};

export const useDialogicState: UseDialogicState = () => {
  // Subscribe to changes
  useStream<TModel>({
    model: () => ({
      _: states,
    }),
    defer: true,
  });
};
