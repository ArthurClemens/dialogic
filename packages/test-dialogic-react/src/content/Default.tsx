import React from 'react';

type TDefault = {
  contentId: string;
  title: string;
  className: string;
  hide: () => void;
};

export function Default(props: TDefault) {
  return (
    <div
      className={props.className}
      data-test-id={`content-default${
        props.contentId ? `-${props.contentId}` : ''
      }`}
    >
      <h2>{props.title}</h2>
      <button
        type='button'
        className='button'
        onClick={() => props.hide()}
        data-test-id='button-hide-content'
      >
        Hide from component
      </button>
    </div>
  );
}
