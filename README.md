## Getting Started

This repository contains a minimal example of a full stack application that
integrates with the [TMDB](https://developer.themoviedb.org/docs/getting-started)
API. The backend is built with **Node.js** and **Express** and the frontend uses
plain HTML and JavaScript.

### Prerequisites

- Node.js >= 18
- An API key from TMDB. Create a free account and obtain the key from their
  dashboard.

### Installation

1. Install the dependencies:

   ```bash
   npm install
   ```

2. Export your TMDB API key in the environment:

   ```bash
   export TMDB_KEY=YOUR_API_KEY
   ```

   sudo systemctl status mongodb

### Running the application

Start the development server with:

```bash
npm start
```

The server listens on port `3000` by default. Open
`http://localhost:3000` in your browser and try searching for a movie or
TV show. You can add results to your personal watchlist, edit notes and
remove items. The watchlist is stored in memory and will reset when the
server restarts.


