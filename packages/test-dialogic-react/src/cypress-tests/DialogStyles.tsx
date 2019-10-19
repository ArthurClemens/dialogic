import React from "react";
import { createFns } from "./createFns";
import { Default } from "../content/Default";
import { Buttons as Buttons } from "./Buttons";
import { dialog, Dialog } from "dialogic-react";

export default () => {
  const fns1 = createFns({
    instance: dialog,
    component: Default,
    title: "DialogStyles",
    styles: (domElement: HTMLElement) => {
      const height = domElement.getBoundingClientRect().height;
      return {
        default: {
          transition: "all 300ms ease-in-out",
        },
        showStart: {
          opacity: "0",
          transform: `translate3d(0, ${height}px, 0)`,
        },
        showEnd: {
          opacity: "1",
          transform: "translate3d(0, 0px,  0)",
        },
        hideEnd: {
          transitionDuration: "450ms",
          transform: `translate3d(0, ${height}px, 0)`,
          opacity: "0",
        },
      }
    },
  });
  const fns2 = createFns({
    instance: dialog,
    component: Default,
    title: "DialogStyles",
    className: "dialog", 
    styles: (domElement: HTMLElement) => {
      const height = domElement.getBoundingClientRect().height;
      return {
        default: {
          transition: "all 300ms ease-in-out",
        },
        hideEnd: {
          transitionDuration: "450ms",
          transform: `translate3d(0, ${height}px, 0)`,
          opacity: "0",
        },
      }
    },
  });

  return (
    <div className="test">
      <Buttons {...fns1} />
      <Buttons {...fns2} name="combi" />
      <div className="spawn default-spawn">
        <Dialog />
      </div>
    </div> 
  );
};
