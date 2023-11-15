import React, { useState } from 'react';

function UseSpool({ onUse, spools }) {
  const [weight, setWeight] = useState("");
  const [note, setNote] = useState("");
  const [model, setModel] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onUse(weight, note, model);
    setWeight("");
    setNote("");
    setModel("");
    setWeight("");
    setNote("");
  };

  let spoolName = spools && spools[0] && spools[0].name ? spools[0].name : "";

  return (
    <div className="card">
      <div className="card-header">
        <h2>Use Spool: {spoolName}</h2>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Weight Used (g):</label>
            <input
              type="number"
              className="form-control"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Weight Used (g)"
              required
            />
          </div>
          <div className="form-group">
            <label>Model:</label>
            <input
              type="text"
              className="form-control"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="Model"
            />
          </div>
          <div className="form-group">
            <label>File:</label>
            <input
              type="text"
              className="form-control"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Filename"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Use
          </button>
        </form>
      </div>
    </div>
  );
}

export default UseSpool;
