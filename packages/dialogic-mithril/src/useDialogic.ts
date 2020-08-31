import { useEffect, useState } from 'mithril-hooks';
import { dialog, notification } from 'dialogic';

import {
  sharedUseDialogic,
  sharedUseDialog,
  sharedUseNotification,
} from 'dialogic-hooks';

export const useDialogic = sharedUseDialogic({ useEffect, useState });
export const useDialog = sharedUseDialog({ useEffect, useState, dialog });
export const useNotification = sharedUseNotification({
  useEffect,
  useState,
  notification,
});
