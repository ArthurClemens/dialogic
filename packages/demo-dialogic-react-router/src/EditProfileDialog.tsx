/* eslint-disable jsx-a11y/control-has-associated-label */
import { FormEvent, FunctionComponent, useState } from 'react';
import { Link } from 'react-router-dom';

export type TEditProfileDialogProps = {
  email: string;
  title: string;
  pathPrefix?: string;
  onCancel: () => void;
  onSave: (email: string) => void;
  increment: () => void;
};

export const EditProfileDialog: FunctionComponent<TEditProfileDialogProps> = props => {
  const [email, setEmail] = useState(props.email);
  return (
    <div className="modal is-active" data-test-id="edit-profile-dialog">
      <div className="modal-background" />
      <form
        className="modal-card"
        onSubmit={(e: FormEvent) => {
          e.preventDefault();
          props.onSave(email);
        }}
      >
        <header className="modal-card-head">
          <p className="modal-card-title" data-test-id="title">
            {props.title}
          </p>
          <button
            type="button"
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
          <div className="footer-buttons">
            <button
              type="submit"
              className="button is-link"
              data-test-id="btn-save"
            >
              Save changes
            </button>

            <Link
              className="button is-link is-light is-outlined"
              to={props.pathPrefix || '/'}
              data-test-id="btn-home"
            >
              Go to home
            </Link>
            <button
              type="button"
              className="button is-link is-light is-outlined"
              onClick={props.increment}
              data-test-id="btn-add-count"
            >
              Dynamic title count
            </button>
            <button
              type="button"
              className="button is-danger is-light is-outlined"
              onClick={() => props.onCancel()}
              data-test-id="btn-cancel"
            >
              Cancel
            </button>
          </div>
        </footer>
      </form>
    </div>
  );
};
