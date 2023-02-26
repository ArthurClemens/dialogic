/* eslint-disable jsx-a11y/control-has-associated-label */
import Link from 'next/link';
import React, { FormEvent } from 'react';

export type EditProfileDialogProps = {
  email: string;
  title: string;
  onCancel: () => void;
  onSave: (email: string) => void;
  increment: () => void;
};

export function EditProfileDialog(props: EditProfileDialogProps) {
  return (
    <div className='modal is-active' data-test-id='edit-profile-dialog'>
      <div className='modal-background' />
      <form
        className='modal-card'
        onSubmit={(e: FormEvent) => {
          e.preventDefault();
          const form = e.currentTarget as HTMLFormElement;
          const input: HTMLInputElement = form?.email;
          props.onSave(input.value);
        }}
      >
        <header className='modal-card-head'>
          <p className='modal-card-title' data-test-id='title'>
            {props.title}
          </p>
          <button
            type='button'
            className='delete'
            onClick={() => {
              props.onCancel();
            }}
            data-test-id='btn-close'
          />
        </header>
        <section className='modal-card-body'>
          <div className='field'>
            <div className='control'>
              <input
                className='input'
                type='email'
                name='email'
                defaultValue={props.email}
                data-test-id='input-email'
              />
            </div>
          </div>
        </section>
        <footer className='modal-card-foot'>
          <div className='footer-buttons'>
            <button
              type='submit'
              className='button is-link'
              data-test-id='btn-save'
            >
              Save changes
            </button>

            <Link
              href='/'
              data-test-id='btn-home'
              className='button is-link is-light is-outlined'
            >
              Go to home
            </Link>
            <button
              type='button'
              className='button is-link is-light is-outlined'
              onClick={props.increment}
              data-test-id='btn-add-count'
            >
              Dynamic title count
            </button>
            <button
              type='button'
              className='button is-danger is-light is-outlined'
              onClick={() => props.onCancel()}
              data-test-id='btn-cancel'
            >
              Cancel
            </button>
          </div>
        </footer>
      </form>
    </div>
  );
}
