import React, { useState } from 'react';

function UseSpool({ onUse }) {
  const [weight, setWeight] = useState('');
  const [note, setNote] = useState('');
  const [model, setModel] = useState(''); // New state variable for the model input

  const handleSubmit = (e) => {
    e.preventDefault();
    const combinedNote = `Note: ${note}, Models: ${model}`;
    onUse(weight, combinedNote); // Send the combined note to the onUse function
    setWeight('');
    setNote('');
    setModel(''); // Reset the model state after submitting
    setWeight('');
    setNote('');
  };

  return (
    <div className="card flex-grow-1">
      <div className="card-header">
        <h2>Use Spool</h2>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Weight Used:</label>
            <input
              type="number"
              className="form-control"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
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
            <label>Note:</label>
            <input
              type="text"
              className="form-control"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Note"
            />
          </div>
          <button type="submit" className="btn btn-primary">Use</button>
        </form>
      </div>
    </div>
  );
}

export default UseSpool;
