import { dialog, notification } from 'dialogic';
import {
  sharedUseDialog,
  sharedUseDialogic,
  sharedUseNotification,
} from 'dialogic-hooks';
import { useEffect, useState } from 'mithril-hooks';

export const useDialogic = sharedUseDialogic({ useEffect, useState });
export const useDialog = sharedUseDialog({ useEffect, useState, dialog });
export const useNotification = sharedUseNotification({
  useEffect,
  useState,
  notification,
});
