import { Dialogic } from 'dialogic';

export namespace DialogicTests {
  export type showFn = () => Promise<Dialogic.Item>;
  export type hideFn = () => Promise<Dialogic.Item>;
}
