import { dialog as _dialog } from "dialogic";
import { getCount } from "./store"; // Access Svelte's store for the count

export const dialog = {
  ..._dialog,
  count: getCount(_dialog.ns),
};
