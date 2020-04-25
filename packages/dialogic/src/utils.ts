export const isClient = typeof document !== 'undefined';
export const isServer = !isClient;

type Fn = (args: any) => any;

export const pipe = (...fns: Fn[]) => (x: any) =>
  fns.filter(Boolean).reduce((y, f) => f(y), x);

export const getStyleValue = ({
  domElement,
  prop,
}: {
  domElement: HTMLElement;
  prop: string;
}) => {
  const defaultView = document.defaultView;
  if (defaultView) {
    const style = defaultView.getComputedStyle(domElement);
    if (style) {
      return style.getPropertyValue(prop);
    }
  }
};
