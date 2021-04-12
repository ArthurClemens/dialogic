import { remaining } from 'dialogic';

let useDialogicCounter = 0;
const useDialogicShared = ({ useEffect, useState, isIgnore, isShow, isHide, instance, deps = [], props = {}, }) => {
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

const useRemainingShared = ({ useState, useMemo, instance, id, spawn, roundToSeconds, }) => {
    const [value, setValue] = useState(undefined);
    const identity = {
        id,
        spawn,
    };
    const exists = !!instance.exists(identity);
    useMemo(() => {
        if (exists) {
            remaining(Object.assign(Object.assign({}, identity), { instance,
                roundToSeconds, callback: newValue => {
                    setValue(newValue);
                } }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [exists]);
    return [value];
};

export { useDialogicShared, useRemainingShared };
//# sourceMappingURL=dialogic-hooks.mjs.map
