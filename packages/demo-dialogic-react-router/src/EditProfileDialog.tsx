import React, { FunctionComponent, useState } from "react";
import { Link } from "react-router-dom";

export type EditProfileDialogProps = {
  email: string;
  title: string;
  onCancel: () => void;
  onSave: (email: string) => void;
};

export const EditProfileDialog: FunctionComponent<
  EditProfileDialogProps
> = props => {
  const [email, setEmail] = useState(props.email);
  return (
    <div className="modal is-active">
      <div className="modal-background" />
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">{props.title}</p>
          <button
            className="delete"
            onClick={() => {
              props.onCancel();
            }}
          />
        </header>
        <section className="modal-card-body">
          <div className="field">
            <div className="control">
              <input
                className="input"
                type="email"
                defaultValue={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
          </div>
        </section>
        <footer className="modal-card-foot">
          <button
            className="button is-link"
            onClick={() => props.onSave(email)}
          >
            Save changes
          </button>
          <button
            className="button is-danger is-light"
            onClick={() => props.onCancel()}
          >
            Cancel
          </button>
          <Link className="button" to="/">
            Go to home
          </Link>
        </footer>
      </div>
    </div>
  );
};
