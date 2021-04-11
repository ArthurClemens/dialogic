import { getStyleValue } from './utils';

export const MODE = {
  SHOW: 'show',
  HIDE: 'hide',
};

export type TransitionStylesFn = (domElement: HTMLElement) => TransitionStyles;

export type TransitionStyles = {
  default?: Partial<CSSStyleDeclaration>;
  showStart?: Partial<CSSStyleDeclaration>;
  showEnd?: Partial<CSSStyleDeclaration>;
  hideStart?: Partial<CSSStyleDeclaration>;
  hideEnd?: Partial<CSSStyleDeclaration>;
};

type TransitionProps = {
  domElement?: HTMLElement;
  className?: string;
  styles?: TransitionStyles | TransitionStylesFn;
  __transitionTimeoutId__?: number;
};

type TransitionClassNames = {
  [key: string]: string[];
  showStart: string[];
  showEnd: string[];
  hideStart: string[];
  hideEnd: string[];
};

type TransitionStep = 'showStart' | 'showEnd' | 'hideStart' | 'hideEnd';
type TransitionStyleState = 'default' | TransitionStep;

type KeyValue = { [key: string]: string };

const removeTransitionClassNames = (
  domElement: HTMLElement,
  transitionClassNames: TransitionClassNames,
) =>
  domElement.classList.remove(
    ...transitionClassNames.showStart,
    ...transitionClassNames.showEnd,
    ...transitionClassNames.hideStart,
    ...transitionClassNames.hideEnd,
  );

const applyTransitionStyles = (
  domElement: HTMLElement,
  step: TransitionStyleState,
  styles: TransitionStyles,
) => {
  const transitionStyle = styles[step] as CSSStyleDeclaration;
  if (transitionStyle) {
    Object.keys(transitionStyle).forEach((key: string) => {
      // Workaround for error "getPropertyValue is not a function"
      const value = ((transitionStyle as unknown) as KeyValue)[key];
      // eslint-disable-next-line no-param-reassign
      ((domElement.style as unknown) as KeyValue)[key] = value;
    });
  }
};

const applyNoDurationTransitionStyle = (domElement: HTMLElement) => {
  // eslint-disable-next-line no-param-reassign
  domElement.style.transitionDuration = '0ms';
};

const getTransitionStyles = (
  domElement: HTMLElement,
  styles: TransitionStyles | TransitionStylesFn,
) => (typeof styles === 'function' ? styles(domElement) : styles) || {};

const createClassList = (className: string, step: string) =>
  className.split(/ /).map((n: string) => `${n}-${step}`);

const applyStylesForState = (
  domElement: HTMLElement,
  props: TransitionProps,
  step: TransitionStep,
  isEnterStep?: boolean,
) => {
  if (props.styles) {
    const styles = getTransitionStyles(domElement, props.styles);
    applyTransitionStyles(domElement, 'default', styles);
    if (isEnterStep) {
      applyNoDurationTransitionStyle(domElement);
    }
    applyTransitionStyles(domElement, step, styles);
  }

  if (props.className) {
    const transitionClassNames: TransitionClassNames = {
      showStart: createClassList(props.className, 'show-start'),
      showEnd: createClassList(props.className, 'show-end'),
      hideStart: createClassList(props.className, 'hide-start'),
      hideEnd: createClassList(props.className, 'hide-end'),
    };
    removeTransitionClassNames(domElement, transitionClassNames);
    if (transitionClassNames) {
      domElement.classList.add(...transitionClassNames[step]);
    }
  }

  // reflow
  // eslint-disable-next-line no-unused-expressions
  domElement.scrollTop;
};

const styleDurationToMs = (durationStr: string) => {
  const parsed =
    parseFloat(durationStr) * (durationStr.indexOf('ms') === -1 ? 1000 : 1);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const getDuration = (domElement: HTMLElement) => {
  const durationStyleValue = getStyleValue({
    domElement,
    prop: 'transition-duration',
  });
  const durationValue =
    durationStyleValue !== undefined
      ? styleDurationToMs(durationStyleValue)
      : 0;
  const delayStyleValue = getStyleValue({
    domElement,
    prop: 'transition-delay',
  });
  const delayValue =
    delayStyleValue !== undefined ? styleDurationToMs(delayStyleValue) : 0;
  return durationValue + delayValue;
};

type Step = {
  nextStep?: TransitionStep;
};

type Steps = {
  showStart: Step;
  showEnd: Step;
  hideStart: Step;
  hideEnd: Step;
};

const steps: Steps = {
  showStart: {
    nextStep: 'showEnd',
  },
  showEnd: {
    nextStep: undefined,
  },
  hideStart: {
    nextStep: 'hideEnd',
  },
  hideEnd: {
    nextStep: undefined,
  },
};

export const transition = (props: TransitionProps, mode?: string) => {
  const { domElement } = props;
  if (!domElement) {
    return Promise.resolve('no domElement');
  }
  clearTimeout(props.__transitionTimeoutId__);

  let currentStep: TransitionStep =
    mode === MODE.SHOW ? 'showStart' : 'hideStart';

  return new Promise(resolve => {
    applyStylesForState(
      domElement,
      props,
      currentStep,
      currentStep === 'showStart',
    );

    setTimeout(() => {
      const { nextStep } = steps[currentStep];
      if (nextStep) {
        currentStep = nextStep;
        applyStylesForState(domElement, props, currentStep);
        // addEventListener sometimes hangs this function because it never finishes
        // Using setTimeout instead of addEventListener gives more consistent results
        const duration = getDuration(domElement);
        // eslint-disable-next-line no-param-reassign
        props.__transitionTimeoutId__ = window.setTimeout(resolve, duration);
      }
    }, 0);
  });
};
