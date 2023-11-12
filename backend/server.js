const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = new sqlite3.Database('./filamentDB.sqlite', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the SQLite database.');
});

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS spools (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        color TEXT,
        initialWeight INTEGER,
        currentWeight INTEGER,
        sort_order INTEGER IDENTITY(1,1) NOT NULL,   
        is_archived INTEGER DEFAULT 0
    )`);
});

app.post("/spools", (req, res) => {
  const { name, color, initialWeight } = req.body;

  // First, find the lowest sort_order in the database
  db.get(
    `SELECT MIN(sort_order) as minSortOrder, max(sort_order) as maxSortOrder FROM spools`,
    [],
    (err, row) => {
      if (err) {
        return console.error(err.message);
      }

      // Determine the next sort_order value
      // If no spools exist, start with a default value (e.g., 0)
      // Otherwise, add 1 to the current max sort_order
      const nextSortOrder =
        row.maxSortOrder !== null ? row.maxSortOrder + 1 : 0;

      // Insert the new spool with the determined sort_order
      db.run(
        `INSERT INTO spools (name, color, initialWeight, currentWeight, sort_order) VALUES (?, ?, ?, ?, ?)`,
        [name, color, initialWeight, initialWeight, nextSortOrder],
        function (insertErr) {
          if (insertErr) {
            return console.error(insertErr.message);
          }
          res.status(201).send({ id: this.lastID, sortOrder: nextSortOrder });
        }
      );
    }
  );
});


app.get('/spools', (req, res) => {
    db.all(`SELECT * FROM spools`, [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.send(rows);
    });
});

app.put('/spools/:id', (req, res) => {
    const { id } = req.params;
    const { name, color, currentWeight } = req.body;
    db.run(`UPDATE spools SET name = ?, color = ?, currentWeight = ? WHERE id = ?`,
    [name, color, currentWeight, id], function(err) {
        if (err) {
            return console.error(err.message);
        }
        res.send({ message: 'Spool updated', spool: { id, name, color, currentWeight } });
    });
});

app.delete('/spools/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM spools WHERE id = ?`, id, function(err) {
        if (err) {
            return console.error(err.message);
        }
        res.send({ message: 'Spool deleted' });
    });
});

app.post('/spools/use/:id', (req, res) => {
    const { id } = req.params;
    const { weight } = req.body;
    db.get(`SELECT currentWeight FROM spools WHERE id = ?`, id, function(err, row) {
        if (err) {
            return console.error(err.message);
        }
        if (row.currentWeight < weight) {
            return res.status(400).send({ message: 'Not enough filament' });
        }
        db.run(`UPDATE spools SET currentWeight = currentWeight - ? WHERE id = ?`, [weight, id], function(err) {
            if (err) {
                return console.error(err.message);
            }
            res.send({ message: 'Filament used' });
        });
    });
});

app.put('/spools/sort/:id', (req, res) => {
    const { id } = req.params;
    const { sortOrder } = req.body;
    db.run(`UPDATE spools SET sort_order = ? WHERE id = ?`, [sortOrder, id], function(err) {
        if (err) {
            return console.error(err.message);
        }
        res.send({ message: 'Spool sort order updated' });
    });
});

app.put("/spools/archive/:id", (req, res) => {
  const { id } = req.params;
  const { isArchived } = req.body; // Expected to be 1 for archive, 0 for unarchive
  console.log("archive", id, isArchived);
  db.run(
    `UPDATE spools SET is_archived = ? WHERE id = ?`,
    [isArchived, id],
    function (err) {
      if (err) {
        return console.error(err.message);
      }
      res.send({ message: "Spool archived status updated" });
    }
  );
});

// Get usage history for a specific spool
app.get("/spools/:id/history", (req, res) => {
    const { id } = req.params;
    db.all(`SELECT * FROM spool_usage_history WHERE spool_id = ?`, [id], (err, rows) => {
        if (err) {
            return res.status(500).send({ message: 'Error fetching spool usage history', error: err.message });
        }
        res.send(rows);
    });
});

// Add a new usage entry for a spool
app.post("/spools/:id/use", (req, res) => {
    const { id } = req.params;
    const { used_amount, note } = req.body;
    db.run(`INSERT INTO spool_usage_history (spool_id, used_amount, note) VALUES (?, ?, ?)`,
        [id, used_amount, note], function (err) {
            if (err) {
                return res.status(500).send({ message: 'Error adding spool usage entry', error: err.message });
            }
            res.status(201).send({ id: this.lastID });
        }
    );
});

// Update a usage entry for a spool
app.put("/spools/:spoolId/history/:entryId", (req, res) => {
    const { spoolId, entryId } = req.params;
    const { used_amount, note } = req.body;
    db.run(`UPDATE spool_usage_history SET used_amount = ?, note = ? WHERE id = ? AND spool_id = ?`,
        [used_amount, note, entryId, spoolId], function (err) {
            if (err) {
                return res.status(500).send({ message: 'Error updating spool usage entry', error: err.message });
            }
            res.send({ message: 'Spool usage entry updated' });
        }
    );
});

// Delete a usage entry for a spool
app.delete("/spools/:spoolId/history/:entryId", (req, res) => {
    const { spoolId, entryId } = req.params;
    db.run(`DELETE FROM spool_usage_history WHERE id = ? AND spool_id = ?`, [entryId, spoolId], function (err) {
        if (err) {
            return res.status(500).send({ message: 'Error deleting spool usage entry', error: err.message });
        }
        res.send({ message: 'Spool usage entry deleted' });
    });
});
  db.get(
    `SELECT * FROM spools WHERE is_archived = 0 ORDER BY sort_order LIMIT 1`,
    [],
    (err, row) => {
      if (err) {
        return console.error(err.message);
      }
      res.send(row);
    }
  );
});

app.post("/spools/use/top", (req, res) => {
  const { weight } = req.body;
  db.get(
    `SELECT id, currentWeight FROM spools WHERE is_archived = 0 ORDER BY sort_order LIMIT 1`,
    [],
    function (err, row) {
      if (err) {
        return console.error(err.message);
      }
      if (row.currentWeight < weight) {
        return res
          .status(400)
          .send({ message: "Not enough filament in the top spool" });
      }
      db.run(
        `UPDATE spools SET currentWeight = currentWeight - ? WHERE id = ?`,
        [weight, row.id],
        function (err) {
          if (err) {
            return console.error(err.message);
          }
          res.send({ message: "Filament used from the top spool" });
        }
      );
    }
  );
});

const port = 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
