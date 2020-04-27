import React from "react";
import { Link } from "react-router-dom";
import { CurrentPathBadge } from "./CurrentPathBadge";

export const HomePage = () => (
  <>
    <h1 className="title">Home</h1>
    <CurrentPathBadge />
    <div className="buttons">
      <Link className="button is-link" to="/profile">
        Go to Profile
      </Link>
    </div>
  </>
);
