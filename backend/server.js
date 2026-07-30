import express from 'express';
import cors from 'cors';
import { initDb } from './database.js';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

let db;

// Initialize DB
(async () => {
  db = await initDb();
  console.log('Database ready');
})();

// Routes

// GET all notes
app.get('/api/notes', async (req, res) => {
  try {
    const notes = await db.all('SELECT * FROM notes ORDER BY created_at DESC');
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single note
app.get('/api/notes/:id', async (req, res) => {
  try {
    const note = await db.get('SELECT * FROM notes WHERE id = ?', req.params.id);
    if (!note) return res.status(404).json({ error: 'Note not found' });
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new note
app.post('/api/notes', async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }
  try {
    const result = await db.run(
      'INSERT INTO notes (title, content) VALUES (?, ?)',
      [title, content]
    );
    const newNote = await db.get('SELECT * FROM notes WHERE id = ?', result.lastID);
    res.status(201).json(newNote);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update note
app.put('/api/notes/:id', async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }
  try {
    const result = await db.run(
      'UPDATE notes SET title = ?, content = ? WHERE id = ?',
      [title, content, req.params.id]
    );
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }
    const updated = await db.get('SELECT * FROM notes WHERE id = ?', req.params.id);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE note
app.delete('/api/notes/:id', async (req, res) => {
  try {
    const result = await db.run('DELETE FROM notes WHERE id = ?', req.params.id);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json({ message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});