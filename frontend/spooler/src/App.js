import React, { useState, useEffect } from "react";
import SpoolList from "./components/SpoolList";
import AddSpool from "./components/AddSpool";
import EditSpool from "./components/EditSpool";
import "bootstrap/dist/css/bootstrap.min.css"; // Make sure to import Bootstrap CSS

function App() {
  const [spools, setSpools] = useState([]);
  const [editingSpool, setEditingSpool] = useState(null);

  const fetchSpools = () => {
    fetch("http://localhost:3000/spools")
      .then((response) => response.json())
      .then((data) => setSpools(data))
      .catch((error) => console.error("Error fetching data:", error));
  };

  useEffect(() => {
    fetchSpools();
  }, []);

  const handleEditInit = (spool) => {
    setEditingSpool(spool);
  };

  const handleEditDone = () => {
    setEditingSpool(null);
    fetchSpools();
  };

  const onArchive = () => {
    fetchSpools();
  };

  const onSort = (spools, spoolId, direction) => {
    // Find the index of the spool we're moving
    const index = spools.findIndex((s) => s.id === spoolId);
    // if (index === -1) return; // Spool not found

    if (index !== -1) {
      let swapIndex = direction === "up" ? index - 1 : index + 1;
      if (swapIndex >= 0 && swapIndex < spools.length) {
        // Swap sort_order values
        let temp = spools[index].sort_order;
        spools[index].sort_order = spools[swapIndex].sort_order;
        spools[swapIndex].sort_order = temp;

        // Create a new array with the swapped elements
        let newSpools = [...spools];
        [newSpools[index], newSpools[swapIndex]] = [newSpools[swapIndex], newSpools[index]];

        // Update the state with the new array
        setSpools(newSpools);
      }
    }

    // Now, we'll need to update the backend with both changes
    Promise.all([
      fetch(`http://localhost:3000/spools/sort/${spools[index].id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sortOrder: spools[index].sort_order }),
      }),
      fetch(`http://localhost:3000/spools/sort/${spools[swapIndex].id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sortOrder: spools[swapIndex].sort_order }),
      }),
    ])
      .then((responses) => Promise.all(responses.map((res) => res.json())))
      .then((data) => console.log("Sort orders updated:", data))
      .catch((error) => console.error("Error updating sort orders:", error));
    fetchSpools();
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Filament Tracker</h1>
      <AddSpool onAdd={fetchSpools} onRefreshSpools={fetchSpools} />
      {editingSpool ? (
        <EditSpool spool={editingSpool} onEdit={handleEditDone} />
      ) : (
        <SpoolList
          onEdit={handleEditInit}
          onDelete={handleEditDone}
          onSort={onSort}
          onArchive={onArchive}
          spools={spools}
        />
      )}
    </div>
  );
}

export default App;
