import { Dialogic } from 'dialogic';

export namespace DialogicTests {
  type showFn<T> = () => Promise<Dialogic.Item<T>>;
  type hideFn<T> = () => Promise<Dialogic.Item<T>>;
}
