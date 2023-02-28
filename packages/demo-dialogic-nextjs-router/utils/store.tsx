import {
  createContext,
  ReactNode,
  Reducer,
  useContext,
  useMemo,
  useReducer,
} from 'react';

export const initialState = { count: 0, email: 'allan@company.com' };

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

type StateData = TState & {
  increment: () => void;
  setEmail: (newEmail: string) => void;
};

const StoreContext = createContext<StateData>({} as StateData);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer<Reducer<TState, TAction>>(
    stateReducer,
    initialState,
  );

  const stateData = useMemo(
    () => ({
      count: state.count,
      email: state.email,
      increment: () => dispatch({ type: 'increment' }),
      setEmail: (newEmail: string) =>
        dispatch({ type: 'email', payload: newEmail }),
    }),
    [state.count, state.email],
  );

  return (
    <StoreContext.Provider value={stateData}>{children}</StoreContext.Provider>
  );
}

export const useStoreContext = () => useContext(StoreContext);
