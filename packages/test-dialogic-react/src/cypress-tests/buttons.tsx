import React from 'react';
import { DialogicTests } from '../..';

type ButtonsProps<T> = {
  showFn: DialogicTests.showFn<T>;
  hideFn: DialogicTests.hideFn<T>;
  name?: string;
  id?: string;
  spawn?: string;
};

export const Buttons = <T,>(props: ButtonsProps<T>) => {
  const genName =
    props.name ||
    `${props.id ? `id${props.id}` : ''}${
      props.spawn ? `spawn${props.spawn}` : ''
    }` ||
    'default';
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
