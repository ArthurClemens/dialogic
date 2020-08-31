import { remaining } from 'dialogic';

let useDialogicCounter = 0;
const sharedUseDialogic = ({ useEffect, useState, }) => (allProps) => {
    const { isIgnore, isShow, isHide, instance, deps = [], props = {}, } = allProps;
    // Create an id if not set.
    // This is useful for pages with multiple dialogs, where we can't expect
    // to have the user set an explicit id for each.
    const [id] = useState(useDialogicCounter++);
    const augProps = {
        ...props,
        ...(props.dialogic
            ? {
                dialogic: {
                    ...props.dialogic,
                    id: props.dialogic.id || id,
                },
            }
            : {
                dialogic: {
                    id,
                },
            }),
    };
    const showInstance = () => {
        instance.show(augProps);
    };
    const hideInstance = () => {
        instance.hide(augProps);
    };
    // maybe show
    useEffect(() => {
        if (isIgnore)
            return;
        if (isShow !== undefined) {
            if (isShow) {
                showInstance();
            }
            else {
                hideInstance();
            }
        }
    }, [...deps, isShow]);
    // maybe hide
    useEffect(() => {
        if (isIgnore)
            return;
        if (isHide !== undefined) {
            if (isHide) {
                hideInstance();
            }
        }
    }, [...deps, isHide]);
    // unmount
    useEffect(() => {
        if (isIgnore)
            return;
        return () => {
            hideInstance();
        };
    }, []);
    return {
        show: showInstance,
        hide: hideInstance,
    };
};
/**
 * `useDialogic` with `instance` set to `dialog`.
 */
const sharedUseDialog = ({ useEffect, useState, dialog, }) => (props) => sharedUseDialogic({ useEffect, useState })({
    ...props,
    instance: dialog,
});
/**
 * `useDialogic` with `instance` set to `notification`.
 */
const sharedUseNotification = ({ useEffect, useState, notification, }) => (props) => sharedUseDialogic({ useEffect, useState })({
    ...props,
    instance: notification,
});

const sharedUseRemaining = ({ useState, useMemo, }) => (props) => {
    const [value, setValue] = useState(undefined);
    const identity = {
        id: props.id,
        spawn: props.spawn,
    };
    const exists = !!props.instance.exists(identity);
    useMemo(() => {
        if (exists) {
            remaining({
                ...identity,
                instance: props.instance,
                roundToSeconds: props.roundToSeconds,
                callback: newValue => {
                    setValue(newValue);
                },
            });
        }
    }, [exists]);
    return [value];
};

export { sharedUseDialog, sharedUseDialogic, sharedUseNotification, sharedUseRemaining };
