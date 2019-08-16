import React, { FunctionComponent } from "react";
import { Dialogic } from "dialogic";

export const Content: FunctionComponent<Dialogic.ContentComponentOptions> = props => (
  <div className={props.className}>
    Content
    <h2>{props.title}</h2>
    <button className="button" onClick={props.hide}>
      Hide from component
    </button>
  </div>
);
