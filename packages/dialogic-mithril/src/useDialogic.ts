import { useEffect } from 'mithril-hooks';
import { dialog, notification } from 'dialogic';

import {
  sharedUseDialogic,
  sharedUseDialog,
  sharedUseNotification,
} from 'dialogic-hooks';

export const useDialogic = sharedUseDialogic({ useEffect });
export const useDialog = sharedUseDialog({ useEffect, dialog });
export const useNotification = sharedUseNotification({
  useEffect,
  notification,
});
