const $ = (id) => document.getElementById(id);
const allMovies = window.CINEMATCH_MOVIES || [];

function selectedValues(select) {
  return Array.from(select.selectedOptions).map(o => Number(o.value));
}
function checkedGenres() {
  return Array.from(document.querySelectorAll('#genreChips input:checked')).map(el => el.value);
}
function checkedHistory() {
  return Array.from(document.querySelectorAll('.history-check:checked')).map(el => Number(el.value));
}
function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function movieCard(movie, isRecommendation=false) {
  const poster = movie.poster || '';
  const reasons = (movie.reasons || []).map(escapeHtml).join(' · ');
  return `<article class="movie-card">
    <div class="poster-wrap">
      <img class="poster-image" data-movie-id="${Number(movie.id)}" src="${escapeHtml(poster)}" alt="${escapeHtml(movie.title)} poster" loading="lazy" ${poster ? '' : 'style="display:none"'} onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
      <div class="poster-fallback" ${poster ? 'style="display:none"' : ''}><span>✦ MELOJOY</span><b>${escapeHtml(movie.title)}</b><small>${escapeHtml(movie.year)}</small></div>
      <span class="rating-badge">★ ${escapeHtml(movie.rating)}${isRecommendation && movie.match_percent != null ? ` · ${escapeHtml(movie.match_percent)}% match` : ''}</span>
    </div>
    <div class="movie-info"><h3>${escapeHtml(movie.title)}</h3>
      <div class="movie-meta">${escapeHtml(movie.year)} · ${escapeHtml((movie.genres || []).join(' / '))}</div>
      <p>${escapeHtml(movie.overview || '')}${isRecommendation ? `<br><br><b>Why:</b> ${reasons}` : ''}</p>
      <div class="card-actions">${isRecommendation ? `<button class="outline-btn use-next" data-id="${Number(movie.id)}">Use for next picks</button>` : `<button class="outline-btn choose-movie" data-id="${Number(movie.id)}">Find similar</button>`}<a class="trailer-btn" href="https://www.youtube.com/results?search_query=${encodeURIComponent(movie.title + ' ' + movie.year + ' official trailer')}" target="_blank" rel="noopener noreferrer">Watch trailer ↗</a></div>
    </div></article>`;
}
async function recommend(selectedId=null) {
  if (selectedId !== null) $('selectedMovie').value = String(selectedId);
  const selected = Number($('selectedMovie').value);
  const history = checkedHistory();
  if (!history.includes(selected)) {
    const check = document.querySelector(`.history-check[value="${selected}"]`);
    if (check) check.checked = true;
  }
  const payload = {
    selected_movie_id: selected,
    history_ids: checkedHistory(),
    liked_ids: selectedValues($('likedMovies')),
    disliked_ids: selectedValues($('dislikedMovies')),
    genres: checkedGenres(),
    language: $('language').value,
    age_group: $('ageGroup').value
  };
  const btn = $('recommendBtn');
  btn.disabled = true; btn.textContent = 'Finding your matches…';
  try {
    const response = await fetch('/api/recommend', {
      method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error('The recommendation server returned an error.');
    const data = await response.json();
    $('recommendationGrid').innerHTML = data.recommendations.map(m => movieCard(m, true)).join('');
    loadPosters($('recommendationGrid'));
    $('resultsIntro').textContent = `Selected: ${allMovies.find(m => Number(m.id) === selected)?.title || 'your movie'}. Recommendations are ranked using story/genre similarity, your history, profile preferences and demo collaborative signals.`;
    $('resultsSection').classList.remove('hidden');
    $('resultsSection').scrollIntoView({behavior:'smooth', block:'start'});
  } catch (err) {
    alert('Could not get recommendations. Make sure the Flask app is running, then refresh the page.');
    console.error(err);
  } finally {
    btn.disabled = false; btn.textContent = '✦ Find my feel-good film';
  }
}
$('recommendBtn').addEventListener('click', () => recommend());
document.addEventListener('click', (event) => {
  const choose = event.target.closest('.choose-movie');
  const next = event.target.closest('.use-next');
  if (choose) recommend(Number(choose.dataset.id));
  if (next) recommend(Number(next.dataset.id));
});
$('movieSearch').addEventListener('input', (e) => {
  const q = e.target.value.toLowerCase().trim();
  document.querySelectorAll('.history-item').forEach(item => {
    item.style.display = item.dataset.title.includes(q) ? 'flex' : 'none';
  });
});
function filterCatalog() {
  const q = $('catalogSearch').value.toLowerCase().trim();
  const genre = $('genreFilter').value;
  document.querySelectorAll('#catalogGrid .movie-card').forEach(card => {
    const textMatch = card.dataset.text.includes(q);
    const genreMatch = !genre || card.dataset.genres.split(',').includes(genre);
    card.style.display = textMatch && genreMatch ? '' : 'none';
  });
}
$('catalogSearch').addEventListener('input', filterCatalog);
$('genreFilter').addEventListener('change', filterCatalog);


// Load real poster artwork only when a card is near the viewport, so the larger catalogue stays fast.
async function fetchPoster(img) {
  if (!img || img.dataset.posterLoaded === 'yes') return;
  img.dataset.posterLoaded = 'yes';
  try {
    const response = await fetch(`/api/poster/${Number(img.dataset.movieId)}`);
    if (!response.ok) return;
    const data = await response.json();
    if (data.poster) {
      img.src = data.poster;
      img.style.display = 'block';
      const fallback = img.nextElementSibling;
      if (fallback) fallback.style.display = 'none';
    }
  } catch (error) { /* fallback poster remains visible if no key/network */ }
}
function loadPosters(container=document) {
  const images = container.querySelectorAll('.poster-image[data-movie-id]');
  if (!('IntersectionObserver' in window)) { images.forEach(fetchPoster); return; }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { observer.unobserve(entry.target); fetchPoster(entry.target); }
    });
  }, { rootMargin: '240px' });
  images.forEach(img => observer.observe(img));
}
loadPosters();
