const mongoose = require('mongoose');

// 1. Define the schema for individual watchlist entries
const WatchItemSchema = new mongoose.Schema({
  tmdbId:     { type: Number, required: true },                 // TMDB movie/show ID
  type:       { type: String, enum: ['movie', 'tv'], required: true },
  title:      { type: String, required: true },
  posterPath: { type: String },                                 // e.g. "/abcd1234.jpg"
  overview:   { type: String },
  rating:     { type: Number, min: 0, max: 10 },
  notes:      { type: String, default: '' },
  watched:    { type: Boolean, default: false },
  addedAt:    { type: Date, default: Date.now }
});

// 2. Define the User schema
const UserSchema = new mongoose.Schema({
  username:  { type: String, required: true, unique: true },
  password:  { type: String, required: true },                  // hashed password
  watchlist: [WatchItemSchema]                                  // array of embedded docs
},
{
  timestamps: true   // automatically adds createdAt / updatedAt on the User
});

// 3. Export the compiled model
module.exports = mongoose.model('User', UserSchema);
