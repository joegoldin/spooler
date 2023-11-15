import React, { useState } from "react";

function AddSpool({ onAdd, onRefreshSpools }) {
  const [spool, setSpool] = useState({ name: "", color: "", initialWeight: 0 });

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(process.env.REACT_APP_SERVER_URI + "/spools", {
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
    <div className="card">
      <div className="card-header">
        <h2>Add Spool</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="card-body">
          <label>Name:</label>
          <input
            type="text"
            className="form-control"
            value={spool.name}
            onChange={(e) => setSpool({ ...spool, name: e.target.value })}
            placeholder="Name"
            required
          />
          <div className="form-group">
            <label>Color:</label>
            <input
              type="text"
              className="form-control"
              value={spool.color}
              onChange={(e) => setSpool({ ...spool, color: e.target.value })}
              placeholder="Color"
              required
            />
          </div>
          <div className="form-group">
            <label>Initial Weight (g):</label>
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
            Add
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddSpool;
