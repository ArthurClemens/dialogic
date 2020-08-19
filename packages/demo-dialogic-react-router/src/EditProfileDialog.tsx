import React, { FunctionComponent, useState } from 'react';
import { Link } from 'react-router-dom';

export type TEditProfileDialogProps = {
  email: string;
  title: string;
  pathPrefix?: string;
  onCancel: () => void;
  onSave: (email: string) => void;
  setCount: React.Dispatch<React.SetStateAction<number>>;
};

export const EditProfileDialog: FunctionComponent<TEditProfileDialogProps> = props => {
  const [email, setEmail] = useState(props.email);
  return (
    <div className="modal is-active" data-test-id="edit-profile-dialog">
      <div className="modal-background" />
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title" data-test-id="title">
            {props.title}
          </p>
          <button
            className="delete"
            onClick={() => {
              props.onCancel();
            }}
            data-test-id="btn-close"
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
                data-test-id="input-email"
              />
            </div>
          </div>
        </section>
        <footer className="modal-card-foot">
          <button
            className="button is-link"
            onClick={() => props.onSave(email)}
            data-test-id="btn-save"
          >
            Save changes
          </button>
          <button
            className="button is-danger is-light"
            onClick={() => props.onCancel()}
            data-test-id="btn-cancel"
          >
            Cancel
          </button>
          <Link
            className="button"
            to={props.pathPrefix || '/'}
            data-test-id="btn-home"
          >
            Go to home
          </Link>
          <button
            className="button"
            onClick={() => props.setCount(current => current + 1)}
            data-test-id="btn-add-count"
          >
            Add count
          </button>
        </footer>
      </div>
    </div>
  );
};
