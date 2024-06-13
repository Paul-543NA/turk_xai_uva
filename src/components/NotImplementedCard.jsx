import React from "react";

const NotImplementedCard = ({ message }) => {
  return (
    <div className="card bg-error text-error-content shadow-xl m-4">
      <div className="card-body">
        <h2 className="card-title">Not implemented yet</h2>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default NotImplementedCard;
