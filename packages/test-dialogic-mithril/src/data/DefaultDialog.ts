import { Dialogic } from "dialogic";
import { dialog } from "dialogic-mithril";
import { getRandomId } from "../utils";

type CreatePropsFn = (props: { component: any }) => Dialogic.Options;

const createProps: CreatePropsFn = (props) => ({
  dialogic: {
    component: props.component,
    className: "xxx",
  },
  className: "xxx-content",
  title: "Default dialog",
  id: getRandomId()
});

type CreateFnsFn = (props: { component: any }) => {
  showFn: () => Promise<Dialogic.Item>;
  hideFn: () => Promise<Dialogic.Item>;
};

export const createFns: CreateFnsFn = ({ component }) => {
  const props = createProps({ component });
  const showFn = () => dialog.show(
    {
      ...props,
      dialogic: {
        ...props.dialogic,
        id: props.id
      },
      title: props.title + ' ' + getRandomId(),
    }
  );
  const hideFn = () => dialog.hide({ id: props.id });

  return {
    showFn,
    hideFn
  };
};
