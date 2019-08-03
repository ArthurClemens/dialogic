const isClient: boolean = true;

import { Dialogic } from "../index";

export const MODE = {
	SHOW: "show",
	HIDE: "hide"
};

type TransitionOptionKeys = {
	[key: string]: boolean;
}

export const transitionOptionKeys: TransitionOptionKeys = {
	showDuration: true,
	showDelay: true,
	showTimingFunction: true,
	hideDuration: true,
	hideDelay: true,
	hideTimingFunction: true,
	transitions: true,
	transitionClass: true,
	showClass: true,
	didShow: true,
	didHide: true,
	timeout: true,
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
	transitionClass?: string;
	showClass?: string;
	showClassElement?: HTMLElement;
} & GetTransitionProps;

export const transition = (props: TransitionProps, mode?: string) => {
	const domElement = props.domElements
		? props.domElements.domElement
		: null;
	if (!domElement) {
		return Promise.reject();
	}
	return new Promise(resolve => {
		const style = domElement.style;
		const computedStyle = isClient
			? window.getComputedStyle(domElement)
			: null;
		const isShow = mode === MODE.SHOW;
		const transitionProps = getTransitionProps({
			showDuration: props.showDuration,
			showDelay: props.showDelay,
			showTimingFunction: props.showTimingFunction,
			hideDuration: props.hideDuration,
			hideDelay: props.hideDelay,
			hideTimingFunction: props.hideTimingFunction,
			transitions: props.transitions,
			domElements: props.domElements,
		}, isShow);
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
			if (props.transitionClass) {
				domElement.classList.add(props.transitionClass);
			}
			if (props.showClass) {
				const showClassElement = props.showClassElement || domElement;
				showClassElement.classList[isShow ? "add" : "remove"](props.showClass);
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
			if (props.transitionClass) {
				domElement.classList.remove(props.transitionClass);
				// domElement.offsetHeight; // force reflow
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
