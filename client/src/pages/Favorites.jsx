import React, { useEffect, useState } from 'react';
import NotesForm from '../components/NotesForm';
import { getFavorites, deleteFavorite } from '../api';

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC',
  });
}

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    getFavorites()
      .then(data => { setFavorites(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, []);

  function handleUpdated(updated) {
    setFavorites(prev => prev.map(f => f._id === updated._id ? updated : f));
  }

  async function handleDelete(id) {
    setDeletingId(id);
    try {
      await deleteFavorite(id);
      setFavorites(prev => prev.filter(f => f._id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) return <div className="page"><p className="loading">Loading your catalog...</p></div>;

  return (
    <div className="page">
      <h2 style={{ marginBottom: '0.25rem' }}>My Catalog</h2>
      <p style={{ color: '#a0a3b1', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        {favorites.length} game{favorites.length !== 1 ? 's' : ''} saved
      </p>

      {error && <p className="error-msg">{error}</p>}

      {favorites.length === 0 && !error && (
        <p className="empty-msg">No games saved yet. Head to <a href="/browse">Browse</a> to start your catalog.</p>
      )}

      <div className="game-grid">
        {favorites.map(fav => (
          <div key={fav._id} className="card">
            <span className="card-date">{formatDate(fav.gameDate)} &mdash; Season {fav.season}–{fav.season + 1}</span>
            <div className="card-matchup">{fav.awayTeam} @ {fav.homeTeam}</div>
            {(fav.homeScore > 0 || fav.awayScore > 0) && (
              <div className="card-score">{fav.awayScore} – {fav.homeScore}</div>
            )}
            {fav.tags && fav.tags.length > 0 && (
              <div>{fav.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}</div>
            )}
            {fav.notes && (
              <p style={{ fontSize: '0.88rem', color: '#c0c3d1', marginTop: '0.25rem' }}>{fav.notes}</p>
            )}

            <NotesForm favorite={fav} onUpdated={handleUpdated} />

            <div className="card-footer" style={{ paddingTop: '0.5rem' }}>
              <button
                className="btn btn-danger"
                onClick={() => handleDelete(fav._id)}
                disabled={deletingId === fav._id}
                style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
              >
                {deletingId === fav._id ? 'Removing...' : 'Remove'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
