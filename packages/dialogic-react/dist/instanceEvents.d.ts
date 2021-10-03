import { Dialogic } from 'dialogic';
export declare const handleDispatch: (ns: string) => (event: Dialogic.InstanceEvent, fn: Dialogic.InitiateItemTransitionFn) => void;
export declare const onInstanceMounted: (ns: string) => (event: Dialogic.InstanceEvent) => void;
export declare const onShowInstance: (ns: string) => (event: Dialogic.InstanceEvent) => void;
export declare const onHideInstance: (ns: string) => (event: Dialogic.InstanceEvent) => void;
