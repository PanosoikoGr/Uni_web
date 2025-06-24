const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;
const TMDB_KEY = process.env.TMDB_KEY || '';

// In-memory store for watchlist and watched items
const watchlist = [];
const watched = [];

app.use(express.json());

app.get('/search', async (req, res) => {
  const query = req.query.q;
  const type = req.query.type === 'tv' ? 'tv' : 'movie';
  if (!query) {
    return res.status(400).json({ error: 'Missing query parameter q' });
  }
  if (!TMDB_KEY) {
    return res.status(500).json({ error: 'TMDB_KEY not set' });
  }
  try {
    const url = `https://api.themoviedb.org/3/search/${type}?api_key=${TMDB_KEY}&query=${encodeURIComponent(query)}`;
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// CRUD operations for personal watchlist
app.get('/watchlist', (req, res) => {
  const list = req.query.list === 'watched' ? watched : watchlist;
  res.json(list);
});

app.post('/watchlist', (req, res) => {
  const item = req.body;
  if (!item || !item.id) {
    return res.status(400).json({ error: 'Invalid item' });
  }
  watchlist.push({ ...item, notes: item.notes || '' });
  res.json({ success: true });
});

app.put('/watchlist/:id', (req, res) => {
  const id = req.params.id;
  const { notes, watched: moveToWatched } = req.body;
  const index = watchlist.findIndex(i => String(i.id) === id);
  if (index === -1) return res.status(404).json({ error: 'Not found' });
  if (notes !== undefined) watchlist[index].notes = notes;
  if (moveToWatched) {
    watched.push(watchlist[index]);
    watchlist.splice(index, 1);
  }
  res.json({ success: true });
});

app.delete('/watchlist/:id', (req, res) => {
  const id = req.params.id;
  const index = watchlist.findIndex(i => String(i.id) === id);
  if (index === -1) return res.status(404).json({ error: 'Not found' });
  watchlist.splice(index, 1);
  res.json({ success: true });
});

app.use(express.static('frontend'));

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
