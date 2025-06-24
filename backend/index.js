// server.js
require('dotenv').config();  // 1. Load .env variables first

const express  = require('express');
const fetch    = require('node-fetch');
const mongoose = require('mongoose');
const bcrypt   = require('bcrypt');       // 3. Secure password hashing
const jwt      = require('jsonwebtoken'); // 4. JWT issuance and verification

// 2. Import User model
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 3000;
const TMDB_KEY = process.env.TMDB_KEY;

// — —  Connect to MongoDB — — 
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser:    true,
    useUnifiedTopology: true
  })
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

app.use(express.json());

// 4a. Helper to sign a JWT for a given user
function signToken(user) {
  return jwt.sign(
    { sub: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
}

// 4b. Middleware to protect routes and extract user ID
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.sub;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// 3. SIGNUP: create a new user with hashed password, return JWT
app.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // 1. Enforce username length
    if (!username || username.length < 6) {
      return res.status(400).json({ error: 'Username must be at least 6 characters.' });
    }

    // 2. Enforce password complexity
    const complexity = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!password || !complexity.test(password)) {
      return res.status(400).json({ error: 'Password must be 8+ chars with uppercase, lowercase, number, and special character.' });
    }

    // 3. Prevent duplicate usernames
    if (await User.exists({ username })) {
      return res.status(409).json({ error: 'Username already taken.' });
    }

    // 4. Hash and save
    const hash = await bcrypt.hash(password, 12);
    const user = await User.create({ username, password: hash });
    const token = signToken(user);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// 4a. LOGIN: verify credentials, return JWT
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Missing username or password' });
    }
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = signToken(user);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// TMDB SEARCH endpoint (unchanged)
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

// 5. WATCHLIST routes tied to authenticated user
app.get('/watchlist',    requireAuth, async (req, res) => {
  const user = await User.findById(req.userId);
  res.json(user.watchlist);
});
app.post('/watchlist',   requireAuth, async (req, res) => {
  const item = req.body;
  const user = await User.findById(req.userId);
  user.watchlist.push({
   tmdbId:     item.id,
    type:       item.type,
    title:      item.title,
    posterPath: item.posterPath,  // now matches the front-end
    overview:   item.overview,
    rating:     item.rating        // now matches the front-end
  });
  await user.save();
  res.json({ success: true });
});
app.put('/watchlist/:tmdbId', requireAuth, async (req, res) => {
  const { notes, watched } = req.body;
  const user = await User.findById(req.userId);
  const entry = user.watchlist.find(w => w.tmdbId === +req.params.tmdbId);
  if (!entry) return res.status(404).json({ error: 'Item not found' });
  if (notes !== undefined)  entry.notes   = notes;
  if (watched !== undefined) entry.watched = watched;
  await user.save();
  res.json({ success: true });
});
app.delete('/watchlist/:tmdbId', requireAuth, async (req, res) => {
  await User.findByIdAndUpdate(req.userId, {
    $pull: { watchlist: { tmdbId: +req.params.tmdbId } }
  });
  res.json({ success: true });
});

// Serve static frontend
app.use(express.static('frontend'));

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
