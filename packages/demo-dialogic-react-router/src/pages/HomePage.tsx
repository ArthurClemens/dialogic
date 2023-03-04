import React from 'react';
import { Link } from 'react-router-dom';

import { CurrentPathBadge } from '../components/CurrentPathBadge';

type TProps = {
  /**
   * Used for e2e tests.
   */
  pathPrefix?: string;
};

export function HomePage({ pathPrefix = '' }: TProps) {
  return (
    <div data-test-id='home-page'>
      <h1 className='title'>Home</h1>
      <CurrentPathBadge />
      <p className='intro'>
        This demo shows the <code>useDialog</code> hook that allows for a
        declarative way of controlling dialogs. The Profile dialog responds to
        the route, and is automatically hidden when using the browser&apos;s
        back button.
      </p>
      <div className='buttons'>
        <Link
          className='button is-link'
          to={`${pathPrefix}/profile`}
          data-test-id='btn-profile'
        >
          Go to Profile
        </Link>
      </div>
    </div>
  );
}
