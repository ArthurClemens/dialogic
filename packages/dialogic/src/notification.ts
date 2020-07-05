import { dialogical } from './dialogical';

export const notification = dialogical({
  ns: 'notification',
  queued: true,
  timeout: 3000,
});
