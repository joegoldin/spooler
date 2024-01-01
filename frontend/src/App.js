import React, { useState, useEffect } from "react";
import SpoolList from "./components/SpoolList";
import AddSpool from "./components/AddSpool";
import EditSpool from "./components/EditSpool";
import UseSpool from "./components/UseSpool";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

function App() {
  const [spools, setSpools] = useState([]);
  const [archivedSpools, setArchivedSpools] = useState([]);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraUrl, setCameraUrl] = useState(
    "http://192.168.1.135:8080/?action=stream"
  );
  const [cameraWidth, setCameraWidth] = useState(640);
  const [cameraHeight, setCameraHeight] = useState(480);
  const [editingSpool, setEditingSpool] = useState(null);
  const [editingHistoryEntry, setEditingHistoryEntry] = useState(null);

  const fetchSpools = () => {
    fetch(process.env.REACT_APP_SERVER_URI + "/spools")
      .then((response) => response.json())
      .then((data) => setSpools(data))
      .catch((error) => console.error("Error fetching data:", error));
    fetch(process.env.REACT_APP_SERVER_URI + "/spools/archived")
      .then((response) => response.json())
      .then((data) => setArchivedSpools(data))
      .catch((error) => console.error("Error fetching data:", error));
  };

  useEffect(() => {
    fetchSpools();
  }, []);
 
  const handleCameraCheckboxChange = (e) => {
    setShowCamera(e.target.checked);
  };

  const handleCameraUrlChange = (e) => {
    setCameraUrl(e.target.value);
  };

  const handleCameraWidthChange = (e) => {
    setCameraWidth(e.target.value);
  }

  const handleCameraHeightChange = (e) => {
    setCameraHeight(e.target.value);
  }

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

  const handleUseSpool = (weight, note, filePath) => {
    // Assuming the top spool is the one being used
    fetch(process.env.REACT_APP_SERVER_URI + "/spools/use/top", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ weight, note, filePath }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(() => {
        fetchSpools();
      })
      .catch((error) => console.error("Error using spool:", error));
  };

  const handleEditHistorySave = (historyEntry) => {
    fetch(
      process.env.REACT_APP_SERVER_URI +
        `/spools/${historyEntry.spoolId}/history/${historyEntry.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          used_amount: historyEntry.used_amount,
          note: historyEntry.note,
        }),
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(() => {
        setEditingHistoryEntry(null);
        fetchSpools();
      })
      .catch((error) =>
        console.error("Error saving edited history entry:", error)
      );
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
      fetch(
        process.env.REACT_APP_SERVER_URI + `/spools/sort/${spools[index].id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sortOrder: spools[index].sort_order }),
        }
      ),
      fetch(
        process.env.REACT_APP_SERVER_URI +
          `/spools/sort/${spools[swapIndex].id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sortOrder: spools[swapIndex].sort_order }),
        }
      ),
    ])
      .then((responses) => Promise.all(responses.map((res) => res.json())))
      .then((data) => console.log("Sort orders updated:", data))
      .then(() => fetchSpools())
      .catch((error) => console.error("Error updating sort orders:", error));
    fetchSpools();
  };

  return (
    <div className="container mt-5">
      <div className="text-center mb-4">
        <img
          src="/logo.png"
          alt="Spooler Logo"
          style={{
            height: "8em",
            verticalAlign: "middle",
          }}
        />
        <h1 className="mb-4" style={{ verticalAlign: "middle" }}>
          Spooler
        </h1>

        <div className="text-center mb-3" style={{ verticalAlign: "middle" }}>
          <div className="row">
            <div className="col text-center">
              <div className="form-check form-switch d-inline-block">
                <i className="fas fa-print mr-2"></i>
                &nbsp;
                <i className="fas fa-video mr-2"></i>
                <input
                  type="checkbox"
                  id="showCamera"
                  checked={showCamera}
                  onChange={handleCameraCheckboxChange}
                  className="form-check-input"
                />
              </div>
            </div>
          </div>
        </div>
        {showCamera && (
          <div className="mb-4">
            <div className="card shadow">
              <div className="card-header">3D Printer Camera</div>
              <div className="card-body">
                <div className="input-group mb-3">
                  <span className="input-group-text">URL:</span>
                  <input
                    type="text"
                    value={cameraUrl}
                    onChange={handleCameraUrlChange}
                    className="form-control"
                    placeholder="Enter camera stream URL"
                  />
                </div>
                <div className="row g-3 mb-3">
                  <div className="col">
                    <div className="input-group">
                      <span className="input-group-text">Width:</span>
                      <input
                        type="number"
                        value={cameraWidth}
                        onChange={handleCameraWidthChange}
                        className="form-control"
                        placeholder="640"
                      />
                    </div>
                  </div>
                  <div className="col">
                    <div className="input-group">
                      <span className="input-group-text">Height:</span>
                      <input
                        type="number"
                        value={cameraHeight}
                        onChange={handleCameraHeightChange}
                        className="form-control"
                        placeholder="480"
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{ background: "#000", padding: "1rem" }}
                >
                  <iframe
                    src={cameraUrl}
                    title="3D Printer Camera"
                    frameBorder="0"
                    style={{
                      width: `${cameraWidth}px`,
                      height: `${cameraHeight}px`,
                      maxWidth: "100%",
                    }}
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
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
          <UseSpool onUse={handleUseSpool} spools={spools} />
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
