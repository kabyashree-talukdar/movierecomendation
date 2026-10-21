# Melojoy — Hybrid Movie Recommendation System

A beginner-friendly portfolio starter combining a web UI and a Python/Flask recommendation backend.

## Features
- Movie catalogue with a curated Bollywood catalogue with 140+ titles, including an expanded Hindi thriller collection.
- User inputs: selected movie, watch history, liked/disliked titles, favourite genres, language, and optional age group.
- Hybrid ranking combines content similarity, watch-history similarity, collaborative signals from clearly labelled synthetic demo profiles, language/genre preferences, and baseline movie rating.
- Poster images load from TMDB when you provide an API key. Without a key, styled fallback artwork is shown.
- Search, genre filtering, and "recommend after this movie" interactions.
- Includes an explanation of why a movie was recommended.

## 1. Install Python
Install Python 3.10+ from https://www.python.org/downloads/ . On Windows, tick "Add Python to PATH" during installation.

## 2. Open this folder in VS Code
Extract the ZIP. In VS Code choose **File → Open Folder** and select `Melojoy_Hybrid_Recommendation_System`.

## 3. Install dependencies
Open **Terminal → New Terminal** in VS Code and run:

```bash
python -m pip install -r requirements.txt
```

## 4. Optional: enable real posters using TMDB
Create a free TMDB account and request an API key:
- https://www.themoviedb.org/
- https://developer.themoviedb.org/docs/getting-started

Do not paste the key into public GitHub code or share it in chat. Set it as an environment variable in the same terminal before starting the app:

**Windows PowerShell**
```powershell
$env:TMDB_API_KEY="PASTE_YOUR_TMDB_API_KEY_HERE"
python app.py
```

**macOS/Linux**
```bash
export TMDB_API_KEY="PASTE_YOUR_TMDB_API_KEY_HERE"
python app.py
```

The key is used by the local backend, not placed in the browser JavaScript. If you do not configure it, the app still works with designed fallback posters. TMDB matching may not find every poster perfectly, so check titles/years before publishing.

This product uses the TMDB API but is not endorsed or certified by TMDB.

## 5. Run the website
If you did not set the API key, run:

```bash
python app.py
```

Open the local address printed in the terminal, usually http://127.0.0.1:5000 .

Important: run this Flask app, not VS Code Live Server. Flask is needed for the recommendation API.

## How the recommendation score works
The demo score uses weighted signals:
- 34% content similarity to the selected movie (title, genres, keywords, overview)
- 18% similarity to watched/liked movies
- 22% collaborative signal from synthetic demo user profiles
- 12% favourite genre match
- 6% language match
- 3% optional age-group-related keywords (weak signal only)
- 5% baseline movie rating

These weights are educational starting points, not scientifically validated values. Tune them using held-out ratings and evaluation metrics.

## Important limitations (honest portfolio notes)
1. Collaborative filtering currently uses **synthetic demo ratings** so the project runs immediately. It does not represent real users. Replace `DEMO_RATINGS` with actual ratings data before claiming real-user personalisation.
2. The current content similarity is a lightweight token-based cosine similarity. For a stronger ML version, use TF-IDF vectors or sentence embeddings and evaluate on a real dataset.
3. The catalogue is a curated starter list with more than 100 titles. Movie metadata and ratings are included as demo seed data; verify details before publishing. For scale, import MovieLens ratings and enrich movies with TMDB metadata/poster paths.
4. The demo does not store profiles in a database. It uses the profile entered during the current request only.
5. Age is an optional, weak contextual signal. Do not infer tastes or suitability from age alone.
6. The starter recommends movies after a selected title; true next-watch sequence prediction needs enough timestamped user histories and should be evaluated separately.

## Next upgrades for a stronger resume project
- Download MovieLens `ml-latest-small` and load `ratings.csv` and `movies.csv`.
- Add user registration and a database for watch history.
- Use scikit-learn TF-IDF + cosine similarity for content features.
- Implement user/item collaborative filtering and compare precision@K, recall@K, and NDCG@K on a held-out set.
- Add a time-aware model only when you have timestamped viewing data.
- Keep API keys on the backend and use environment variables.


## Melojoy branding and trailer links
- The app branding is Melojoy throughout the page. The local folder name can also be changed to `Melojoy_Hybrid_Recommendation_System` if you want, but this is optional and does not change how Flask runs.
- “Watch trailer” opens a YouTube search for the title and year. It does not guarantee that the first result is official; check the channel before sharing. Full-film streaming is not provided.
- The thriller catalogue is a curated list; some films have multiple genres. Use the genre filter to browse Thriller titles.
