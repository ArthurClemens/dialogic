import React from "react";
import { useLocation } from "react-router-dom";

export const CurrentPathBadge = () => {
  const location = useLocation();
  return (
    <div>
      <span className="tag">{location.pathname}</span>
    </div>
  );
};
