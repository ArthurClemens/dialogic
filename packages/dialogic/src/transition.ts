
import { isClient } from "./utils";
import { Dialogic } from "../index";

export const MODE = {
	SHOW: "show",
	HIDE: "hide"
};

type TransitionOptionKeys = {
	[key: string]: boolean;
}

export const transitionOptionKeys: TransitionOptionKeys = {
	className: true,
	component: true,
	didHide: true,
	didShow: true,
	hideDelay: true,
	hideDuration: true,
	hideTimingFunction: true,
	showClassName: true,
	showDelay: true,
	showDuration: true,
	showTimingFunction: true,
	timeout: true,
	transitionClassName: true,
	transitions: true,
};

type GetTransitionProps = {
	showDuration?: number;
	showDelay?: number;
	showTimingFunction?: string;
	hideDuration?: number;
	hideDelay?: number;
	hideTimingFunction?: string;
	transitions?: Dialogic.Transitions;
	domElements?: Dialogic.DomElements;
}

type TransitionProps = {
	domElements?: Dialogic.DomElements;
	showClassElement?: HTMLElement;
	showClassName?: string;
	transitionClassName?: string;
} & GetTransitionProps;

export const transition = (props: TransitionProps, mode?: string) => {
	const domElement = props.domElements
		? props.domElements.domElement
		: null;
	if (!domElement) {
		return Promise.resolve("no domElement");
	}
	return new Promise(resolve => {
		const style = domElement.style;
		const computedStyle = isClient
			? window.getComputedStyle(domElement)
			: null;
		const isShow = mode === MODE.SHOW;
		const transitionProps = getTransitionProps(props, isShow);
		const duration = transitionProps.duration !== undefined
			? transitionProps.duration * 1000
			: computedStyle
				? styleDurationToMs(computedStyle.transitionDuration)
				: 0;
		const delay = transitionProps.delay !== undefined
			? transitionProps.delay * 1000
			: computedStyle
				? styleDurationToMs(computedStyle.transitionDelay)
				: 0;
		const totalDuration = duration + delay;

		const before = () => {
			if (transitionProps.before && typeof transitionProps.before === "function") {
				style.transitionDuration = "0ms";
				style.transitionDelay = "0ms";
				transitionProps.before();
			}
		};

		const after = () => {
			if (transitionProps.after && typeof transitionProps.after === "function") {
				transitionProps.after();
			}
		};
		
		const applyTransition = () => {
			// Set styles
			const timingFunction = transitionProps.timingFunction
				// or when set in CSS:
				|| (
					computedStyle
						? computedStyle.transitionTimingFunction
						: undefined
					);
			if (timingFunction) {
				style.transitionTimingFunction = timingFunction;
			}
			style.transitionDuration = duration + "ms";
			style.transitionDelay = delay + "ms";
			
			// Set classes (need to be set after styles)
			if (props.transitionClassName) {
				domElement.classList.add(props.transitionClassName);
			}
			if (props.showClassName) {
				const showClassElement = props.showClassElement || domElement;
				showClassElement.classList[isShow ? "add" : "remove"](props.showClassName);
			}
							
			// Call transition function
			if (transitionProps.transition) {
				transitionProps.transition();
			}
		};

		before();	
		
		applyTransition();
		setTimeout(() => {
			after();
			if (props.transitionClassName) {
				domElement.classList.remove(props.transitionClassName);
			}
			resolve();
		}, totalDuration);
	});
};

const styleDurationToMs = (durationStr: string) => {
	const parsed = parseFloat(durationStr) * (durationStr.indexOf("ms") === -1 ? 1000 : 1);
	return isNaN(parsed)
		? 0
		: parsed;
};

const getTransitionProps = (props: GetTransitionProps, isShow: boolean) => {
	const [duration, delay, timingFunction, transition] = isShow
		? [props.showDuration, props.showDelay, props.showTimingFunction, props.transitions ? props.transitions.show : undefined]
		: [props.hideDuration, props.hideDelay, props.hideTimingFunction, props.transitions ? props.transitions.hide : undefined]
	return {
		duration,
		delay,
		timingFunction,
		...(transition
			? transition(props.domElements)
			: undefined
		)
	};
};
