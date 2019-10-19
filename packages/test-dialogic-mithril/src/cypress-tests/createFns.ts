
import { Dialogic } from "dialogic";
import { getRandomId } from "./utils";
import { DialogicTests } from "../..";

type CreateFnsFn = (props: {
  instance: Dialogic.DialogicInstance,
  component: any,
  className?: string,
  id?: string,
  spawn?: string,
  title: string,
  styles?: any,
  timeout?: number,
  queued?: boolean,
}) => {
  showFn: DialogicTests.showFn;
  hideFn: DialogicTests.hideFn;
};

export const createFns: CreateFnsFn = ({ instance, component, className, title, id, spawn, styles, timeout, queued }) => {
  const contentId = `${id ? `id${id}` : ''}${spawn ? `spawn${spawn}` : ''}`;
  const props = {
    dialogic: {
      component: component,
      className,
      styles,
      id,
      spawn,
      ...(spawn !== undefined 
        ? { spawn }
        : undefined
      ),
      ...(timeout !== undefined 
        ? { timeout }
        : undefined
      ),
      ...(queued !== undefined 
        ? { queued }
        : undefined
      ),
    },
    className: "instance-content",
    id: getRandomId(),
    contentId
  };
  
  const showFn = () => instance.show(
    {
      ...props,
      title: `${title} ${getRandomId()}`,
    }
  );
  const hideFn = () => instance.hide(
    {
      ...props,
      title: `${title} ${getRandomId()} hiding`,
    }
  );

  return {
    showFn,
    hideFn
  };
};
