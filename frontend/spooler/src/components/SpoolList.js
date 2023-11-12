import { FaArrowUp, FaArrowDown, FaArchive } from "react-icons/fa";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import "./SpoolList.css"; // Make sure to create this CSS file for animations

function SpoolList({ title, onEdit, onDelete, onSort, onArchive, onEditHistory, onDeleteHistory, spools }) {

  const handleEditHistory = (spoolId, historyEntry) => {
    onEditHistory(spoolId, historyEntry);
  };

  const handleDeleteHistory = (spoolId, historyEntryId) => {
    if (window.confirm("Are you sure you want to delete this history entry?")) {
      fetch(`http://localhost:3000/spools/${spoolId}/history/${historyEntryId}`, { method: "DELETE" })
        .then(() => onDeleteHistory(spoolId))
        .catch((error) => console.error("Error deleting history entry:", error));
    }
  };
  const handleDelete = (id) => {
    fetch(`http://localhost:3000/spools/${id}`, { method: "DELETE" })
      .then(() => onDelete())
      .catch((error) => console.error("Error deleting spool:", error));
  };

  const handleSort = (spool, direction) => {
    onSort(spools, spool.id, direction);
  };

  const handleArchive = (id, archived) => {
    console.log("handleArchive", id, archived);
    fetch(`http://localhost:3000/spools/archive/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isArchived: archived }),
    })
      .then(() => onArchive())
      .catch((error) => console.error("Error archiving spool:", error));
  };

  return (
    <div>
      <h2 className="h4 mb-3">{title}</h2>
      <TransitionGroup component="ul" className="list-group">
        {spools
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((spool) => (
            <CSSTransition
              key={spool.id}
              timeout={500}
              classNames="spool"
              appear={false}
            >
              <li className="list-group-item">
                <div className="d-flex justify-content-between align-items-center">
                  {spool.name} ({spool.color}) - {spool.currentWeight}g left
                </div>
                <div className="mt-2">
                  {spool.usage_history && spool.usage_history.length > 0 && (
                    <div className="table-responsive">
                      <table className="table table-sm table-hover mt-2">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Used Amount</th>
                            <th>Note</th>
                          </tr>
                        </thead>
                        <tbody>
                          {spool.usage_history.map((historyEntry) => (
                            <tr key={historyEntry.id}>
                              <td>{new Date(historyEntry.timestamp).toLocaleDateString()} {new Date(historyEntry.timestamp).toLocaleTimeString()}</td>
                              <td>{historyEntry.used_amount}g</td>
                              <td>{historyEntry.note}</td>
                              <td>
                                {props.editingHistoryEntry && props.editingHistoryEntry.id === historyEntry.id ? (
                                  <>
                                    <input
                                      type="number"
                                      value={props.editingHistoryEntry.used_amount}
                                      onChange={(e) => props.setEditingHistoryEntry({ ...props.editingHistoryEntry, used_amount: e.target.value })}
                                      className="form-control form-control-sm mx-1"
                                      style={{ width: 'auto', display: 'inline' }}
                                    />
                                    <button
                                      onClick={() => props.handleEditHistorySave(props.editingHistoryEntry)}
                                      className="btn btn-sm btn-success mx-1"
                                    >
                                      Save
                                    </button>
                                  </>
                                ) : (
                                  <button
                                    onClick={() => props.onEditHistory(spool.id, historyEntry)}
                                    className="btn btn-sm btn-warning mx-1"
                                  >
                                    Edit
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDeleteHistory(spool.id, historyEntry.id)}
                                  className="btn btn-sm btn-danger mx-1"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
                <div>
                  <button
                    onClick={() => handleSort(spool, "up")}
                    className={`btn btn-sm btn-secondary mx-1 ${
                      spools[0].id === spool.id ? "disabled" : ""
                    }`}
                    disabled={spools[0].id === spool.id}
                  >
                    <FaArrowUp />
                  </button>
                  <button
                    onClick={() => handleSort(spool, "down")}
                    className={`btn btn-sm btn-secondary mx-1 ${
                      spools[spools.length - 1].id === spool.id
                        ? "disabled"
                        : ""
                    }`}
                    disabled={spools[spools.length - 1].id === spool.id}
                  >
                    <FaArrowDown />
                  </button>
                  <button
                    onClick={() => onEdit(spool)}
                    className="btn btn-sm btn-warning mx-1"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(spool.id)}
                    className="btn btn-sm btn-danger mx-1"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleArchive(spool.id, !spool.is_archived)}
                    className="btn btn-sm btn-info mx-1"
                  >
                    <FaArchive />
                  </button>
                </div>
              </li>
            </CSSTransition>
          ))}
      </TransitionGroup>
    </div>
  );
}

export default SpoolList;
