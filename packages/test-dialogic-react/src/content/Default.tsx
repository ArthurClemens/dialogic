import React, { FunctionComponent } from "react"
import { Dialogic } from "dialogic";

type Default = FunctionComponent<Dialogic.ContentComponentOptions>;

export const Default: FunctionComponent<Dialogic.ContentComponentOptions> = props => (
  <div
    className={props.className}
    data-test-id={`content-default${props.contentId ? `-${props.contentId}` : ''}`}
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
