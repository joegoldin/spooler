import { FaArrowUp, FaArrowDown, FaArchive } from "react-icons/fa";
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import './SpoolList.css'; // Make sure to create this CSS file for animations

function SpoolList({ onEdit, onDelete, onSort, onArchive, spools }) {
  const handleDelete = (id) => {
    fetch(`http://localhost:3000/spools/${id}`, { method: "DELETE" })
      .then(() => onDelete())
      .catch((error) => console.error("Error deleting spool:", error));
  };

  const handleSort = (spool, direction) => {
    onSort(spools, spool.id, direction);
  };

  const handleArchive = (id, archived) => {
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
      <h2 className="h4 mb-3">Filament Spools</h2>
      <TransitionGroup component="ul" className="list-group">
        {spools.sort((a, b) => a.sort_order - b.sort_order)
          .map((spool) => (
            <CSSTransition key={`${spool.id}-${spool.sort_order}`} timeout={500} classNames="spool">
              <li
                className="list-group-item d-flex justify-content-between align-items-center"
              >
              [{spool.sort_order}] {spool.name} ({spool.color}) - {spool.currentWeight}g left
              <div>
                <button
                  onClick={() => handleSort(spool, "up")}
                  className={`btn btn-sm btn-secondary mx-1 ${spools[0].id === spool.id ? 'disabled' : ''}`}
                  disabled={spools[0].id === spool.id}
                >
                  <FaArrowUp />
                </button>
                <button
                  onClick={() => handleSort(spool, "down")}
                  className={`btn btn-sm btn-secondary mx-1 ${spools[spools.length - 1].id === spool.id ? 'disabled' : ''}`}
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
                  onClick={() => handleArchive(spool.id, true)}
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
