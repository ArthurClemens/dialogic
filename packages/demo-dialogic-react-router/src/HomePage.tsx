import React from 'react';
import { Link } from 'react-router-dom';
import { CurrentPathBadge } from './CurrentPathBadge';

type TProps = {
  pathPrefix?: string;
};

export const HomePage = ({ pathPrefix = '' }: TProps) => (
  <div data-test-id="home-page">
    <h1 className="title">Home</h1>
    <CurrentPathBadge />
    <div className="buttons">
      <Link
        className="button is-link"
        to={`${pathPrefix}/profile`}
        data-test-id="btn-profile"
      >
        Go to Profile
      </Link>
    </div>
  </div>
);
