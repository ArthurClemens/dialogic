
import { Dialogic } from "dialogic";
import { getRandomId } from "./utils";
import { DialogicTests } from "..";

type CreateFnsFn = (props: {
  instance: Dialogic.DialogicInstance,
  component: any,
  className?: string,
  id?: string,
  spawn?: string,
  title: string,
  styles?: any
}) => {
  showFn: DialogicTests.showFn;
  hideFn: DialogicTests.hideFn;
};

export const createFns: CreateFnsFn = ({ instance, component, className, title, id, spawn, styles }) => {
  const contentId = `${id ? `id${id}` : ''}${spawn ? `spawn${spawn}` : ''}`;
  const props = {
    dialogic: {
      component: component,
      className,
      styles,
      id,
      spawn
    },
    className: "instance-content",
    id: getRandomId(),
    contentId
  };
  
  const showFn = () => instance.show(
    {
      ...props,
      title: title + " " + getRandomId(),
    }
  );
  const hideFn = () => instance.hide(props.dialogic);

  return {
    showFn,
    hideFn
  };
};
