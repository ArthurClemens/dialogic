import { Dialogic } from 'dialogic';

export namespace DialogicTests {
  export type showFn<T> = () => Promise<Dialogic.Item<T>>;
  export type hideFn<T> = () => Promise<Dialogic.Item<T>>;
}
