import { dialog as dialogicDialog } from "dialogic";
import { getCount } from "../dialogic/stores";

export const dialog = {
  ...dialogicDialog,
  count: getCount(dialogicDialog.ns)
};
