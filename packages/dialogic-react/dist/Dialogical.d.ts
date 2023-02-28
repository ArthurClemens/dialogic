/// <reference types="../../node_modules/@types/react" />
import { Dialogic } from 'dialogic';
type Props = {
    instance: Dialogic.DialogicInstance;
} & Dialogic.ComponentOptions;
export declare function Dialogical({ instance, ...props }: Props): JSX.Element;
export {};
