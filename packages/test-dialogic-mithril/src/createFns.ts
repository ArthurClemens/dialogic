
import { Dialogic } from "dialogic";
import { getRandomId } from "./utils";
import { DialogicTests } from "..";

type CreateFnsFn = (props: {
  instance: Dialogic.DialogicInstance,
  component: any,
  className?: string,
  title: string,
  styles?: any
}) => {
  showFn: DialogicTests.showFn;
  hideFn: DialogicTests.hideFn;
};

export const createFns: CreateFnsFn = ({ instance, component, className, title, styles }) => {
  const props = {
    dialogic: {
      component: component,
      className,
      styles
    },
    className: "instance-content",
    id: getRandomId()
  };
  
  const showFn = () => instance.show(
    {
      ...props,
      dialogic: {
        ...props.dialogic,
        id: props.id
      },
      title: title + " " + getRandomId(),
    }
  );
  const hideFn = () => instance.hide({ id: props.id });

  return {
    showFn,
    hideFn
  };
};
