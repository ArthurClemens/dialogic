import { Dialogic } from "dialogic";

export namespace DialogicTests {
  type showFn = () => Promise<Dialogic.Item>;
  type hideFn = () => Promise<Dialogic.Item>;
}
