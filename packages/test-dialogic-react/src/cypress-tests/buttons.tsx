import React from "react";
import { DialogicTests } from "../..";

type ButtonsProps = {
  showFn: DialogicTests.showFn;
  hideFn: DialogicTests.hideFn;
  name?: string;
  id?: string;
  spawn?: string;
}

export const buttons = ({ showFn, hideFn, id, spawn, name }: ButtonsProps) => {
  const genName = name || `${id ? `id${id}` : ''}${spawn ? `spawn${spawn}` : ''}` || "default";
  return (
    <div className="buttons">
      {showFn && (
        <button
          className="button primary"
          onClick={showFn}
          data-test-id={`button-show-${genName}`}
        >
          {`Show ${genName}`}
        </button>
      )}
      {hideFn && (
        <button
          className="button"
          onClick={hideFn}
          data-test-id={`button-hide-${genName}`}
        >
          {`Hide ${genName}`}
        </button>
      )}
    </div>
  );
};
