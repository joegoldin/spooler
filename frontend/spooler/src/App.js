import React, { useState, useEffect } from "react";
import SpoolList from "./components/SpoolList";
import AddSpool from "./components/AddSpool";
import EditSpool from "./components/EditSpool";
import UseSpool from "./components/UseSpool";
import "bootstrap/dist/css/bootstrap.min.css"; // Make sure to import Bootstrap CSS

function App() {
  const [spools, setSpools] = useState([]);
  const [archivedSpools, setArchivedSpools] = useState([]);
  const [editingSpool, setEditingSpool] = useState(null);
  const [editingHistoryEntry, setEditingHistoryEntry] = useState(null);

  const fetchSpools = () => {
    fetch("http://localhost:3000/spools")
      .then((response) => response.json())
      .then((data) => setSpools(data))
      .catch((error) => console.error("Error fetching data:", error));
    fetch("http://localhost:3000/spools/archived")
      .then((response) => response.json())
      .then((data) => setArchivedSpools(data))
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

  const handleEditHistoryInit = (spoolId, historyEntry) => {
    setEditingHistoryEntry({ spoolId, ...historyEntry });
  };

  const handleUseSpool = (weight, note) => {
    // TODO: Implement the logic to send the "use spool" data to the backend
    console.log('Using spool with weight:', weight, 'and note:', note);
    // After successful backend update, refresh the spools list
    fetchSpools();
  };

  const handleEditHistorySave = (historyEntry) => {
    fetch(`http://localhost:3000/spools/${historyEntry.spoolId}/history/${historyEntry.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        used_amount: historyEntry.used_amount,
        note: historyEntry.note,
      }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(() => {
      setEditingHistoryEntry(null);
      fetchSpools();
    })
    .catch((error) => console.error('Error saving edited history entry:', error));
  };

  const handleDeleteHistory = (spoolId, historyEntryId) => {
      fetchSpools();
  };

  const onArchive = () => {
    fetchSpools();
  };

  const onUnArchive = () => {
    fetchSpools();
  };

  const onSort = (spools, spoolId, direction) => {
    // Find the index of the spool we're moving
    const index = spools.findIndex((s) => s.id === spoolId);
    // if (index === -1) return; // Spool not found

    let swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex >= 0 && swapIndex < spools.length) {
      // Swap sort_order values
      let temp = spools[index].sort_order;
      spools[index].sort_order = spools[swapIndex].sort_order;
      spools[swapIndex].sort_order = temp;

      // Create a new array with the swapped elements
      let newSpools = [...spools];
      [newSpools[index], newSpools[swapIndex]] = [
        newSpools[swapIndex],
        newSpools[index],
      ];
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
      .then(() => fetchSpools())
      .catch((error) => console.error("Error updating sort orders:", error));
    fetchSpools();
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Filament Tracker</h1>
      <br />
      {editingSpool ? (
        <EditSpool spool={editingSpool} onEdit={handleEditDone} />
      ) : (
        <>
          <SpoolList
            title="Active Spools"
            onEdit={handleEditInit}
            onDelete={handleEditDone}
            onEditHistory={handleEditHistoryInit}
            onDeleteHistory={handleDeleteHistory}
            onSort={onSort}
            onArchive={onArchive}
            editingHistoryEntry={editingHistoryEntry}
            setEditingHistoryEntry={setEditingHistoryEntry}
            handleEditHistorySave={handleEditHistorySave}
            spools={spools}
          />
          <br />
        </>
      )}
      <br />
      <div className="row d-flex" style={{ height: "100%" }}>
        <div
          className="col-md-6 d-flex flex-column"
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          <AddSpool onAdd={fetchSpools} onRefreshSpools={fetchSpools} />
        </div>
        <div
          className="col-md-6 d-flex flex-column"
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          <UseSpool onUse={handleUseSpool} />
        </div>
      </div>
      <br />
      <br />
      <SpoolList
        title="Archived Spools"
        onEdit={handleEditInit}
        onDelete={handleEditDone}
        onEditHistory={handleEditHistoryInit}
        onDeleteHistory={handleDeleteHistory}
        onSort={onSort}
        onArchive={onUnArchive}
        editingHistoryEntry={editingHistoryEntry}
        setEditingHistoryEntry={setEditingHistoryEntry}
        handleEditHistorySave={handleEditHistorySave}
        spools={archivedSpools}
      />
      <br />
      <br />
    </div>
  );
}

export default App;
