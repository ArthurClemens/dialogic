import { useReducer, Reducer } from 'react';

const initialState = { count: 0, email: 'allan@company.com' };

type TState = typeof initialState;

type TAction = {
  type: string;
  payload?: string;
};

const stateReducer = (state: TState, action: TAction): TState => {
  switch (action.type) {
    case 'email':
      return action.payload
        ? {
            ...state,
            email: action.payload,
          }
        : state;
    case 'increment':
      return { ...state, count: state.count + 1 };
    default:
      throw new Error();
  }
};

export const useStore = () => {
  const [state, dispatch] = useReducer<Reducer<TState, TAction>>(
    stateReducer,
    initialState,
  );

  return {
    count: state.count,
    email: state.email,
    increment: () => dispatch({ type: 'increment' }),
    setEmail: (newEmail: string) =>
      dispatch({ type: 'email', payload: newEmail }),
  };
};

export type TStore = ReturnType<typeof useStore>;
