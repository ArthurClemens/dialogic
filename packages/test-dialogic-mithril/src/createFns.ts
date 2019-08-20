
import { Dialogic } from "dialogic";
import { getRandomId } from "./utils";
import { DialogicTests } from "..";

type CreateFnsFn = (props: {
  instance: Dialogic.DialogicInstance,
  component: any,
  className?: string,
  id?: string,
  title: string,
  styles?: any
}) => {
  showFn: DialogicTests.showFn;
  hideFn: DialogicTests.hideFn;
};

export const createFns: CreateFnsFn = ({ instance, component, className, title, id, styles }) => {
  const props = {
    dialogic: {
      component: component,
      className,
      styles,
      id
    },
    className: "instance-content",
    id: getRandomId(),
    contentId: id
  };
  
  const showFn = () => instance.show(
    {
      ...props,
      title: title + " " + getRandomId(),
    }
  );
  const hideFn = () => instance.hide(id !== undefined ? { id } : undefined);

  return {
    showFn,
    hideFn
  };
};
