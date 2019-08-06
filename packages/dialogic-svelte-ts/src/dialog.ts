import { dialog as dialogicDialog } from "dialogic";
import { getCount } from "./store";

export const dialog = {
  ...dialogicDialog,
  count: getCount(dialogicDialog.ns)
};
