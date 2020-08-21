const sharedUseDialogic = ({ useEffect }) => (allProps) => {
    const { isIgnore, isShow, isHide, instance, deps = [], props = {}, } = allProps;
    const showInstance = () => {
        instance.show(props);
    };
    const hideInstance = () => {
        instance.hide(props);
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
const sharedUseDialog = ({ useEffect, dialog, }) => (props) => sharedUseDialogic({ useEffect })({
    ...props,
    instance: dialog,
});
/**
 * `useDialogic` with `instance` set to `notification`.
 */
const sharedUseNotification = ({ useEffect, notification, }) => (props) => sharedUseDialogic({ useEffect })({ ...props, instance: notification });

export { sharedUseDialog, sharedUseDialogic, sharedUseNotification };
