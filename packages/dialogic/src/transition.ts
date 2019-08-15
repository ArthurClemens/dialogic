
import { getStyleValue } from "./utils";
import { Dialogic } from "../index";

export const MODE = {
	SHOW: "show",
	HIDE: "hide"
};

type TransitionProps = {
	domElement?: HTMLElement;
	className?: string;
	styles?: Dialogic.TransitionStyles | Dialogic.TransitionStylesFn;
}

type TransitionClassNames = {
	[key:string]: string;
	showStart: string;
	showEnd: string;
	hideStart: string;
	hideEnd: string;
}

type TransitionStep = "showStart" | "showEnd" | "hideStart" | "hideEnd";
type TransitionStyleState = "default" | TransitionStep;

const removeTransitionClassNames = (domElement: HTMLElement, transitionClassNames: TransitionClassNames) => 
	domElement.classList.remove(
		transitionClassNames.showStart,
		transitionClassNames.showEnd,
		transitionClassNames.hideStart,
		transitionClassNames.hideEnd,
	);

const applyTransitionStyles = (domElement: HTMLElement, step: TransitionStyleState, styles: Dialogic.TransitionStyles) => {
	const transitionStyle = styles[step] as CSSStyleDeclaration || {};
	Object.keys(transitionStyle).forEach((key: any) => {
		const value = transitionStyle[key].toString();
		domElement.style[key] = value;
		// if (domElement.style[key] !== value) {
		// 	console.warn(`Invalid style: ${key}: ${value} (${domElement.style[key]})`);
		// }
	});
};

const applyNoDurationTransitionStyle = (domElement: HTMLElement) =>
	domElement.style.transitionDuration = "0ms";

const getTransitionStyles = (domElement: HTMLElement, styles: Dialogic.TransitionStyles | Dialogic.TransitionStylesFn) =>
	(typeof styles === "function"
		? styles(domElement)
		: styles
	) || {};

const applyStylesForState = (domElement: HTMLElement, props: TransitionProps, step: TransitionStep, isEnterStep?: boolean) => {
	if (props.styles) {
		const styles = getTransitionStyles(domElement, props.styles);
		applyTransitionStyles(domElement, "default", styles);
		isEnterStep && applyNoDurationTransitionStyle(domElement);
		applyTransitionStyles(domElement, step, styles);
	}

	if (props.className) {
		const transitionClassNames: TransitionClassNames = {
			showStart: `${props.className}-show-start`,
			showEnd: `${props.className}-show-end`,
			hideStart: `${props.className}-hide-start`,
			hideEnd: `${props.className}-hide-end`
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
	showStart: Step;
	showEnd: Step;
	hideStart: Step;
	hideEnd: Step;
}

const steps: Steps = {
	showStart: {
		nextStep: "showEnd"
	},
	showEnd: {
		nextStep: undefined
	},
	hideStart: {
		nextStep: "hideEnd"
	},
	hideEnd: {
		nextStep: undefined
	},
};

export const transition = (props: TransitionProps, mode?: string) => {
	const domElement = props.domElement;
	if (!domElement) {
		return Promise.resolve("no domElement");
	}

	let currentStep: TransitionStep = mode === MODE.SHOW
		? "showStart"
		: "hideStart";

	return new Promise(resolve => {

		applyStylesForState(domElement, props, currentStep, currentStep === "showStart");

		const nextStep = steps[currentStep].nextStep;
		if (nextStep) {
			setTimeout(() => {
				currentStep = nextStep;
				applyStylesForState(domElement, props, currentStep);
				// addEventListener sometimes hangs this function because it never finishes
				// Using setTimeout instead of addEventListener gives more consistent results
				const duration = getDuration(domElement);
				setTimeout(resolve, duration);
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
