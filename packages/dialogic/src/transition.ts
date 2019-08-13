
import { getStyleValue } from "./utils";
import { Dialogic } from "../index";

export const MODE = {
	SHOW: "show",
	HIDE: "hide"
};

type TransitionOptionKeys = {
	[key: string]: boolean;
}

export const transitionOptionKeys: TransitionOptionKeys = {
	component: true,
	didHide: true,
	didShow: true,
	timeout: true,
	transitionClassName: true,
	transitionStyles: true,
};

type TransitionProps = {
	domElement?: HTMLElement;
	transitionClassName?: string;
	transitionStyles?: Dialogic.TransitionStyles | Dialogic.TransitionStylesFn;
}

type TransitionClassNames = {
	[key:string]: string;
	enter: string;
	enterActive: string;
	exit: string;
	exitActive: string;
}

type TransitionStep = "enter" | "enterActive" | "exit" | "exitActive";
type TransitionStyleState = "default" | TransitionStep;

const removeTransitionClassNames = (domElement: HTMLElement, transitionClassNames: TransitionClassNames) => 
	domElement.classList.remove(
		transitionClassNames.enter,
		transitionClassNames.enterActive,
		transitionClassNames.exit,
		transitionClassNames.exitActive,
	);

const applyTransitionStyles = (domElement: HTMLElement, step: TransitionStyleState, transitionStyles: Dialogic.TransitionStyles) => {
	const transitionStyle = transitionStyles[step] as CSSStyleDeclaration || {};
	Object.keys(transitionStyle).forEach((key: any) => {
		domElement.style[key] = transitionStyle[key];
	});
};

const applyNoDurationTransitionStyle = (domElement: HTMLElement) =>
	domElement.style.transitionDuration = "0ms";

const getTransitionStyles = (domElement: HTMLElement, transitionStyles: Dialogic.TransitionStyles | Dialogic.TransitionStylesFn) =>
	(typeof transitionStyles === "function"
		? transitionStyles(domElement)
		: transitionStyles
	) || {};

const applyStylesForState = (domElement: HTMLElement, props: TransitionProps, step: TransitionStep, isEnterStep?: boolean) => {
	if (props.transitionStyles) {
		const transitionStyles = getTransitionStyles(domElement, props.transitionStyles);
		applyTransitionStyles(domElement, "default", transitionStyles);
		isEnterStep && applyNoDurationTransitionStyle(domElement);
		applyTransitionStyles(domElement, step, transitionStyles);
	}

	if (props.transitionClassName) {
		const transitionClassNames: TransitionClassNames = {
			enter: `${props.transitionClassName}-enter`,
			enterActive: `${props.transitionClassName}-enter-active`,
			exit: `${props.transitionClassName}-exit`,
			exitActive: `${props.transitionClassName}-exit-active`
		};
		removeTransitionClassNames(domElement, transitionClassNames);
		transitionClassNames && domElement.classList.add(transitionClassNames[step]);
	}
};

const getDuration = (domElement: HTMLElement) => {
	const durationStyleValue = getStyleValue({ domElement, prop: "transition-duration" });
	const durationValue = durationStyleValue !== undefined
		? styleDurationToMs(durationStyleValue)
		: 0;
	const delayStyleValue = getStyleValue({ domElement, prop: "transition-delay" });
	const delayValue = delayStyleValue !== undefined
		? styleDurationToMs(delayStyleValue)
		: 0;
	return durationValue + delayValue;
};

type Step = {
	nextStep?: TransitionStep;
}

type Steps = {
	enter: Step;
	enterActive: Step;
	exit: Step;
	exitActive: Step;
}

const steps: Steps = {
	enter: {
		nextStep: "enterActive"
	},
	enterActive: {
		nextStep: undefined
	},
	exit: {
		nextStep: "exitActive"
	},
	exitActive: {
		nextStep: undefined
	},
};

export const transition = (props: TransitionProps, mode?: string) => {
	const domElement = props.domElement;
	if (!domElement) {
		return Promise.reject("no domElement");
	}

	let currentStep: TransitionStep = mode === MODE.SHOW
		? "enter"
		: "exit";

	return new Promise(resolve => {
		
		const onEnd = () => {
			domElement.removeEventListener("transitionend", onEnd, false);
			resolve();
		};

		applyStylesForState(domElement, props, currentStep, currentStep === "enter");

		const nextStep = steps[currentStep].nextStep;
		if (nextStep) {
			setTimeout(() => {
				currentStep = nextStep;
				domElement.addEventListener("transitionend", onEnd, false);
				applyStylesForState(domElement, props, currentStep);
				// Due to incorrect CSS usage, ontransitionend may not be fired
				// Using a timeout ensures completion
				const duration = getDuration(domElement);
				if (duration == 0) {
					setTimeout(onEnd, duration);
				}
			}, 0);
		}
	});
};

const styleDurationToMs = (durationStr: string) => {
	const parsed = parseFloat(durationStr) * (durationStr.indexOf("ms") === -1 ? 1000 : 1);
	return isNaN(parsed)
		? 0
		: parsed;
};
