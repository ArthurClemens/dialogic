
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
	transitionStyles?: Dialogic.TransitionStyles;
}

type TransitionClassNames = {
	enter: string;
	enterActive: string;
	exit: string;
	exitActive: string;
}

const removeTransitionClassNames = (domElement: HTMLElement, transitionClassNames: TransitionClassNames) => 
	domElement.classList.remove(
		transitionClassNames.enter,
		transitionClassNames.enterActive,
		transitionClassNames.exit,
		transitionClassNames.exitActive,
	);

const applyTransitionStyles = (domElement: HTMLElement, stateName: string, transitionStyles: Dialogic.TransitionStyles) => {
	const transitionStyle = transitionStyles[stateName] as CSSStyleDeclaration;
	if (transitionStyle) {
		Object.keys(transitionStyle).forEach((key: any) => {
			domElement.style[key] = transitionStyle[key];
		});
	}
};

export const transition = (props: TransitionProps, mode?: string) => {
	const domElement = props.domElement;
	if (!domElement) {
		return Promise.resolve("no domElement");
	}
	return new Promise(resolve => {
		
		const state = {
			isShow: mode === MODE.SHOW,
			name: mode === MODE.SHOW
				? "enter"
				: "exit"
		};

		if (props.transitionStyles) {
			applyTransitionStyles(domElement, "default", props.transitionStyles);
			applyTransitionStyles(domElement, state.name, props.transitionStyles);
		}

		const transitionClassNames = props.transitionClassName
			? {
				enter: `${props.transitionClassName}-enter`,
				enterActive: `${props.transitionClassName}-enter-active`,
				exit: `${props.transitionClassName}-exit`,
				exitActive: `${props.transitionClassName}-exit-active`
			}
			: undefined;

		// reflow
		domElement.scrollTop;

		const before = () => {

			if (transitionClassNames) {
				removeTransitionClassNames(domElement, transitionClassNames);
				domElement.classList.add(state.isShow
					? transitionClassNames.enter
					: transitionClassNames.exit
				);
				domElement.scrollTop;
			}
			if (state.isShow) {
				// reflow
				domElement.scrollTop;
			}
		};
		
		const applyTransition = () => {
			if (props.transitionStyles) {
				applyTransitionStyles(domElement, "default", props.transitionStyles);
				applyTransitionStyles(domElement, state.name, props.transitionStyles);
			}
			// Set classes (need to be set after styles)
			if (transitionClassNames) {
				removeTransitionClassNames(domElement, transitionClassNames);
				domElement.classList.add(state.isShow
					? transitionClassNames.enterActive
					: transitionClassNames.exitActive
				);
			}
		};

		const onEnd = () => {
			domElement.removeEventListener("transitionend", onEnd, false);
			resolve();
		};

		domElement.addEventListener("transitionend", onEnd, false);

		before();
		state.name = state.isShow 
			? "enterActive"
			: "exitActive";
		applyTransition();

		const durationStyleValue = getStyleValue({ domElement, prop: "transition-duration" });
		const durationValue = durationStyleValue !== undefined
			? styleDurationToMs(durationStyleValue)
			: 0;
		const delayStyleValue = getStyleValue({ domElement, prop: "transition-delay" });
		const delayValue = delayStyleValue !== undefined
			? styleDurationToMs(delayStyleValue)
			: 0;
		const duration = durationValue + delayValue;

		// console.log("duration", duration);

		// Due to incorrect CSS usage, ontransitionend may not be fired
		// Using a timeout ensures completion
		if (duration == 0) {
			setTimeout(onEnd, duration);
		}
	});
};

const styleDurationToMs = (durationStr: string) => {
	const parsed = parseFloat(durationStr) * (durationStr.indexOf("ms") === -1 ? 1000 : 1);
	return isNaN(parsed)
		? 0
		: parsed;
};
