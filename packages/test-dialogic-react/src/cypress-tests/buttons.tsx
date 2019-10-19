import React, { FunctionComponent } from "react";
import { DialogicTests } from "../..";

type ButtonsProps = {
  showFn: DialogicTests.showFn;
  hideFn: DialogicTests.hideFn;
  name?: string;
  id?: string;
  spawn?: string;
}

export const Buttons: FunctionComponent<ButtonsProps> = props => {
  const genName = props.name || `${props.id ? `id${props.id}` : ''}${props.spawn ? `spawn${props.spawn}` : ''}` || "default";
  return (
    <div className="buttons">
      {props.showFn && (
        <button
          className="button primary"
          onClick={props.showFn}
          data-test-id={`button-show-${genName}`}
        >
          {`Show ${genName}`}
        </button>
      )}
      {props.hideFn && (
        <button
          className="button"
          onClick={props.hideFn}
          data-test-id={`button-hide-${genName}`}
        >
          {`Hide ${genName}`}
        </button>
      )}
    </div>
  );
};
