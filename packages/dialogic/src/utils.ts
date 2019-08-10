export const isClient = typeof document !== "undefined";
export const isServer = !isClient;

type Fn = (args:any) => any;
export const pipe = (...fns: Fn[]) => (x: any) =>
  fns.filter(Boolean).reduce((y, f) => f(y), x);
