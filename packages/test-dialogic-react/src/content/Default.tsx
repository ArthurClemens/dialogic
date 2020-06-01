import React from 'react';

type TDefault = {
  contentId: string;
  title: string;
  className: string;
  hide: () => void;
};

export const Default = (props: TDefault) => (
  <div
    className={props.className}
    data-test-id={`content-default${
      props.contentId ? `-${props.contentId}` : ''
    }`}
  >
    <h2>{props.title}</h2>
    <button
      className="button"
      onClick={() => props.hide()}
      data-test-id="button-hide-content"
    >
      Hide from component
    </button>
  </div>
);
