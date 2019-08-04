import { dialog as dialogicDialog } from "dialogic";
import { getCount } from "./stores";

export const dialog = {
  ...dialogicDialog,
  count: getCount(dialogicDialog.ns)
};
