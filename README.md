# Uni_web

Ανάπτυξη Web Εφαρμογής για ταινίες με διασύνδεση με το
TMDB API.
Σκοπός αυτής της εργασίας είναι η δημιουργία μιας πλήρως λειτουργικής web εφαρμογής με
διακριτό frontend και backend και διασύνδεση με το TMDB API (ή κάποιο αντίστοιχο web API
με δεδομένα ταινιών), που θα επιτρέπει στον χρήστη να:
• Αναζητά, εμφανίζει και αποθηκεύει πληροφορίες για ταινίες και τηλεοπτικές σειρές,
όπως τίτλος, έτος κυκλοφορίας, ηθοποιούς, εικόνες, κοκ. και για τις σειρές να
υπάρχει πρόβλεψη καταχώρησης κύκλων και επισοδίων.
• Προβολή αποτελεσμάτων με εικόνες (posters), βαθμολογίες, περιλήψεις και ότι άλλα
στοιχεία επιστρέφει το API.
• Οργανώνει το δικό του προσωπικό κατάλογο (watchlist ή αγαπημένα).
• Εκτελεί βασικές λειτουργίες CRUD (Create, Read, Update, Delete) πάνω σε δικά του
δεδομένα. Δηλαδή να μπορεί να προσθέτει και δικές τους ταινίες / σειρές.
• Εμφάνιση προσωπικής λίστας και δυνατότητα:
o Επεξεργασίας σχολίων/σημειώσεων ανά καταχώριση.
o Διαγραφής από τη λίστα ή/και μεταφοράς σε μια άλλη λίστα (π.χ. watched).
• Αλληλεπιδρά σε πραγματικό χρόνο με δεδομένα που προέρχονται δυναμικά από το
εξωτερικό API του TMDB.
•
Περισσότερες πληροφορίες για το TMDB API μπορείτε να βρείτε εδώ:
https://developer.themoviedb.org/docs/getting-started
Στα πλαίσια της εργασίας θα πρέπει να διαχωρίσετε frontend και backend και να τηρήσετε
τις αρχές της modular ανάπτυξης, καλών πρακτικών προγραμματισμού και τεκμηρίωσης και
η εφαρμογή σας να υποστηρίζει responsive σχεδίαση όταν ανοίγει από tablet ή mobile.
Μαθησιακοί Στόχοι
• Προχωρημένη κατανόηση της αρχιτεκτονικής Full Stack Web Development.
• Δυνατότητα υλοποίησης πλήρους CRUD λειτουργιών στο backend.
• Ασφαλής και βελτιστοποιημένη διαχείριση χρηστών (authentication/authorization).
• Σχεδίαση βάσης δεδομένων και δημιουργία σχέσεων (π.χ. χρήστες – λίστες – ταινίες).
• Χρήση εξωτερικού API για δυναμική άντληση δεδομένων.
• Χρήση asynchronous programming και χειρισμός API responses με error handling.
Για να αναπτύξετε τη συγκεκριμένη εφαρμογή μπορείτε να χρησιμοποιήσετε οποιεσδήποτε
από τις τεχνολογίες Web front-end και back-end ή/και frameworks.

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

### Running the application

Start the development server with:

```bash
npm start
```

The server listens on port `3000` by default. Open
`http://localhost:3000` in your browser and try searching for a movie.

### Project structure

- `backend/index.js` – Express server that proxies search requests to TMDB
- `frontend/index.html` – Simple web page to perform movie searches

This is only a starting point for the final project described above. You can
extend it with your own features such as user authentication, watchlists and
CRUD operations for personal data.
