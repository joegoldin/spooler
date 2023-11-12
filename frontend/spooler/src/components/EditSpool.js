import React, { useState } from "react";

function EditSpool({ spool, onEdit }) {
  const [editedSpool, setEditedSpool] = useState(spool);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`http://localhost:3000/spools/${spool.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editedSpool),
    })
      .then(() => onEdit())
      .catch((error) => console.error("Error updating spool:", error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit Spool</h2>
      <input
        type="text"
        value={editedSpool.name}
        onChange={(e) =>
          setEditedSpool({ ...editedSpool, name: e.target.value })
        }
        required
      />
      <input
        type="text"
        value={editedSpool.color}
        onChange={(e) =>
          setEditedSpool({ ...editedSpool, color: e.target.value })
        }
        required
      />
      <input
        type="number"
        value={editedSpool.currentWeight}
        onChange={(e) =>
          setEditedSpool({ ...editedSpool, currentWeight: e.target.value })
        }
        required
      />
      <button type="submit">Update Spool</button>
    </form>
  );
}

export default EditSpool;
