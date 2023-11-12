import React, { useState } from "react";

function AddSpool({ onAdd, onRefreshSpools }) {
  const [spool, setSpool] = useState({ name: "", color: "", initialWeight: 0 });

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:3000/spools", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(spool),
    })
      .then((response) => response.json())
      .then(() => onAdd())
      .catch((error) => console.error("Error adding spool:", error));
    onRefreshSpools();
  };

  return (
    <div className="card card-body my-4">
      <form onSubmit={handleSubmit}>
        <h2 className="h4 mb-3">Add Spool</h2>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            value={spool.name}
            onChange={(e) => setSpool({ ...spool, name: e.target.value })}
            placeholder="Name"
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            value={spool.color}
            onChange={(e) => setSpool({ ...spool, color: e.target.value })}
            placeholder="Color"
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="number"
            className="form-control"
            value={spool.initialWeight}
            onChange={(e) =>
              setSpool({ ...spool, initialWeight: e.target.value })
            }
            placeholder="Initial Weight (g)"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Add Spool
        </button>
      </form>
    </div>
  );
}

export default AddSpool;
