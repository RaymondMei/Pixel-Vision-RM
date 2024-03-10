import React from "react";

function PlayerListTile({ username, color, avatar, isAdmin }) {
  return (
    <div
      className="p-4 fs-3 text-center border-bottom list-group-item list-group-item-action"
      style={{ color: color }}
    >
      <span className="start-0 ms-5 position-absolute">{`${avatar} `}</span>
      <span>{`${username}`}</span>

      {isAdmin ? <AdminBadge /> : null}
    </div>
  );
}

const AdminBadge = () => {
  return (
    <h5 className="d-inline top-50 translate-middle-y position-absolute">
      <span className="badge bg-success ms-3">Admin</span>
    </h5>
  );
};

export default PlayerListTile;
