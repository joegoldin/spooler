import React, { useState } from 'react';

function UseSpool({ onUse }) {
  const [weight, setWeight] = useState('');
  const [note, setNote] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onUse(weight, note);
    setWeight('');
    setNote('');
  };

  return (
    <div>
      <h2>Use Spool</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Weight Used:</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Note:</label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
        <button type="submit">Use</button>
      </form>
    </div>
  );
}

export default UseSpool;
