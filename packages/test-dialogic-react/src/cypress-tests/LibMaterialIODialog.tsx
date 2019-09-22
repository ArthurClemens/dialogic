import React from "react";
import { dialog, Dialog } from "dialogic-react";

const DemoContent = () => (
  <div className="mdc-dialog__container">
    <div className="mdc-dialog__surface">
      <h2 className="mdc-dialog__title" id="my-dialog-title">Dialog Title</h2>
      <div className="mdc-dialog__content" id="my-dialog-content">
        Dialog body text goes here.
      </div>
      <footer className="mdc-dialog__actions">
        <button
          type="button"
          className="mdc-button mdc-dialog__button"
          data-mdc-dialog-action="no"
          onClick={() => dialog.hide()}
        >
          <span className="mdc-button__label">No</span>
        </button>
        <button
          type="button"
          className="mdc-button mdc-dialog__button"
          data-mdc-dialog-action="yes"
          onClick={() => dialog.hide()}
        >
          <span className="mdc-button__label">Yes</span>
        </button>
      </footer>
    </div>
  </div>
);
    
const MaterialIODialogComponent = ({ isModal = false } : { isModal?: boolean }) => (
  <div
    className="mdc-dialog mdc-dialog--open"
    role="alertdialog"
    aria-modal="true"
    aria-labelledby="my-dialog-title"
    aria-describedby="my-dialog-content"
    >
      <DemoContent />
      <div
        className="mdc-dialog__scrim"
        onClick={() => !isModal && dialog.hide()}
      />
  </div>
);

export default () => (
  <div className="test">
    <div className="control" data-test-id="hide-all">
      <div className="buttons">
        <button
          className="button"
          onClick={() => dialog.show({
            dialogic: {
              component: () => <MaterialIODialogComponent />,
              className: "dialog",
            }
          })}
        >
          Show dialog
        </button>
        <button
          className="button"
          onClick={() => dialog.show({
            dialogic: {
              component: () => <MaterialIODialogComponent isModal />,
              className: "dialog",
            }
          })}
        >
          Show modal dialog
        </button>
      </div>
    </div>
    <div className="materialIO">
      <Dialog />
    </div>
  </div> 
);
