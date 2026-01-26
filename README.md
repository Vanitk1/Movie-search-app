**Movie Search App**

A movie search web application built with vanilla HTML, CSS, and JavaScript. Search for movies, view details, and save your favourites.

**Live Demo**

https://vanitk1.github.io/Movie-search-app/

**Features**

Search movies — Search the OMDB database by movie title
View details — Click any movie to see full details (rating, genre, director, cast, plot)
User sign-in — Simple sign-in to save your favourites
Save favourites — Add movies to your favourites list
Favourites page — View and manage your saved movies
Loading states — Visual feedback while searching
Error handling — Friendly messages when no results found
Responsive design — Works on desktop and mobile

**Technologies used**

HTML5
CSS3
JavaScript (ES6+)
OMDB API
localStorage for data persistence

**Setup**

Get an API key:

Go to OMDB API
Select "Free" and enter your email
Activate via the email link

Add your API key:

Open app.js
Replace the API_KEY value with your key:

javascript:  const API_KEY = "your_api_key_here";

Run the app:

Open index.html in your browser
Or use Live Server in VS Code

**How to use**

Sign in — Click "Sign In" and enter your name
Search — Type a movie title and click Search (or press Enter)
View details — Click any movie card to see full information
Save favourites — Click "❤️ Add to Favourites" in the movie details
View favourites — Click the "Favourites" link in the header
Remove favourites — Open a movie from favourites and click "Remove"

**API reference**

This app uses the OMDB API:

Search by title: Returns list of matching movies
Get details: Returns full movie details

**Data storage**

Data is stored in localStorage



