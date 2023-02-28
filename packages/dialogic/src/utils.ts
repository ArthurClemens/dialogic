export const isClient = typeof document !== 'undefined';
export const isServer = !isClient;

export const getStyleValue = ({
  domElement,
  prop,
}: {
  domElement: HTMLElement;
  prop: string;
}) => {
  const { defaultView } = document;
  if (defaultView) {
    const style = defaultView.getComputedStyle(domElement);
    if (style) {
      return style.getPropertyValue(prop);
    }
  }
  return undefined;
};
