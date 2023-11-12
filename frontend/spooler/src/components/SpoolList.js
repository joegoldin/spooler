import { FaArrowUp, FaArrowDown, FaArchive } from "react-icons/fa";

function SpoolList({ onEdit, onDelete, onSort, onArchive, spools }) {
  const handleDelete = (id) => {
    fetch(`http://localhost:3000/spools/${id}`, { method: "DELETE" }).catch(
      (error) => console.error("Error deleting spool:", error)
    );
    onDelete();
  };

  const handleSort = (spool, direction) => {
    onSort(spools, spool.id, direction);
  };

  const handleArchive = (id, archived) => {
    fetch(`http://localhost:3000/spools/archive/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isArchived: archived }),
    }).catch((error) => console.error("Error archiving spool:", error));
    onArchive();
  };

  return (
    <div>
      <h2 className="h4 mb-3">Filament Spools</h2>
      <ul className="list-group">
        {spools
          .map((spool) => (
            <li
              key={spool.sort_order}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              [{spool.sort_order}] {spool.name} ({spool.color}) - {spool.currentWeight}g left
              <div>
                <button
                  onClick={() => handleSort(spool, "up")}
                  className="btn btn-sm btn-secondary mx-1"
                >
                  <FaArrowUp />
                </button>
                <button
                  onClick={() => handleSort(spool, "down")}
                  className="btn btn-sm btn-secondary mx-1"
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
          ))}
      </ul>
    </div>
  );
}

export default SpoolList;
