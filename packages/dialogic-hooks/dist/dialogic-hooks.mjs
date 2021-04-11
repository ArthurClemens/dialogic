import { remaining } from 'dialogic';

let useDialogicCounter = 0;
const sharedUseDialogic = ({ useEffect, useState, }) => (allProps) => {
    const { isIgnore, isShow, isHide, instance, deps = [], props = {}, } = allProps;
    // Create an id if not set.
    // This is useful for pages with multiple dialogs, where we can't expect
    // to have the user set an explicit id for each.
    // eslint-disable-next-line no-plusplus
    const [id] = useState(useDialogicCounter++);
    const augProps = Object.assign(Object.assign({}, props), (props.dialogic
        ? {
            dialogic: Object.assign(Object.assign({}, props.dialogic), { id: props.dialogic.id || id }),
        }
        : {
            dialogic: {
                id,
            },
        }));
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...deps, isHide]);
    // unmount
    useEffect(() => {
        if (isIgnore)
            return;
        // eslint-disable-next-line consistent-return
        return () => {
            hideInstance();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return {
        show: showInstance,
        hide: hideInstance,
    };
};
/**
 * `useDialogic` with `instance` set to `dialog`.
 */
const sharedUseDialog = ({ useEffect, useState, dialog, }) => (props) => sharedUseDialogic({ useEffect, useState })(Object.assign(Object.assign({}, props), { instance: dialog }));
/**
 * `useDialogic` with `instance` set to `notification`.
 */
const sharedUseNotification = ({ useEffect, useState, notification, }) => (props) => sharedUseDialogic({ useEffect, useState })(Object.assign(Object.assign({}, props), { instance: notification }));

const sharedUseRemaining = ({ useState, useMemo, }) => (props) => {
    const [value, setValue] = useState(undefined);
    const identity = {
        id: props.id,
        spawn: props.spawn,
    };
    const exists = !!props.instance.exists(identity);
    useMemo(() => {
        if (exists) {
            remaining(Object.assign(Object.assign({}, identity), { instance: props.instance, roundToSeconds: props.roundToSeconds, callback: newValue => {
                    setValue(newValue);
                } }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [exists]);
    return [value];
};

export { sharedUseDialog, sharedUseDialogic, sharedUseNotification, sharedUseRemaining };
//# sourceMappingURL=dialogic-hooks.mjs.map
