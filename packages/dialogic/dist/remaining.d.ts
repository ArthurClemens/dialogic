/**
 * Utility script that uses an animation frame to pass the current remaining value
 * (which is utilized when setting `timeout`).
 */
import { DialogicInstance } from './types';
type RemainingProps = {
    /**
     * Dialogic instance: notification, dialog, or custom.
     */
    instance: DialogicInstance;
    id?: string;
    spawn?: string;
    /**
     * Set to true to return seconds instead of milliseconds.
     */
    roundToSeconds?: boolean;
    /**
     * Returns the remaining time as milliseconds. Returns `undefined` when the timer is not running (before and after the timer runs).
     */
    callback: (displayValue: number | undefined) => unknown;
};
export declare const remaining: (props: RemainingProps) => void;
export {};
