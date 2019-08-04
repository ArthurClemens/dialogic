import { dialog as _dialog } from "dialogic";
import { getCount } from "./stores";

export const dialog = {
  ..._dialog,
  count: getCount(_dialog.ns)
};
