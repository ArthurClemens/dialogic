import React from 'react';
import { useLocation } from 'react-router-dom';

export const CurrentPathBadge = () => {
  const location = useLocation();
  return (
    <div className="control path-control">
      <span className="tag" data-test-id="current-path">
        {location.pathname}
      </span>
    </div>
  );
};
