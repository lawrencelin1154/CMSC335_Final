import React, { useState, useEffect } from 'react';
import FilterForm from '../components/FilterForm';
import GameCard from '../components/GameCard';
import { getGames, getFavorites, saveFavorite } from '../api';

export default function Browse() {
  const [games, setGames] = useState([]);
  const [meta, setMeta] = useState(null);
  const [savedIds, setSavedIds] = useState(new Set());
  const [savingId, setSavingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState(null);
  const [cursor, setCursor] = useState(null);

  useEffect(() => {
    getFavorites()
      .then(favs => setSavedIds(new Set(favs.map(f => f.gameId))))
      .catch(() => {});
  }, []);

  async function handleFilter(params) {
    setLoading(true);
    setError('');
    setGames([]);
    setMeta(null);
    setCursor(null);
    setActiveFilter(params);
    try {
      const data = await getGames(params);
      setGames(data.data || []);
      setMeta(data.meta || null);
      setCursor(data.meta?.next_cursor || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleLoadMore() {
    if (!activeFilter || !cursor) return;
    setLoading(true);
    try {
      const data = await getGames({ ...activeFilter, cursor });
      setGames(prev => [...prev, ...(data.data || [])]);
      setMeta(data.meta || null);
      setCursor(data.meta?.next_cursor || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(game) {
    setSavingId(game.id);
    try {
      await saveFavorite({
        gameId: game.id,
        gameDate: game.date,
        homeTeam: game.home_team.full_name,
        awayTeam: game.visitor_team.full_name,
        homeScore: game.home_team_score,
        awayScore: game.visitor_team_score,
        season: game.season,
        notes: '',
        tags: [],
      });
      setSavedIds(prev => new Set([...prev, game.id]));
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="page">
      <h2 style={{ marginBottom: '1rem' }}>Browse Games</h2>

      <div className="game-grid" style={{ marginBottom: '1.5rem' }}>
        {[
          { team: 'Cleveland Cavaliers', years: '2003–2010, 2014–2018' },
          { team: 'Miami Heat',          years: '2010–2014' },
          { team: 'Los Angeles Lakers', years: '2018–present' },
        ].map(({ team, years }) => (
          <div key={team} className="card" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.75rem' }}>
            <div>
              <h3>{team}</h3>
              <p style={{ color: '#a0a3b1', fontSize: '0.85rem', marginTop: '0.25rem' }}>{years}</p>
            </div>
          </div>
        ))}
      </div>

      <FilterForm onFilter={handleFilter} loading={loading} />

      {error && <p className="error-msg">{error}</p>}

      {!activeFilter && !loading && (
        <p className="empty-msg">Select a season and team above to browse games.</p>
      )}

      {activeFilter && !loading && games.length === 0 && !error && (
        <p className="empty-msg">No games found for the selected filters.</p>
      )}

      <div className="game-grid">
        {games.map(game => (
          <GameCard
            key={game.id}
            game={game}
            isSaved={savedIds.has(game.id)}
            onSave={handleSave}
            saving={savingId === game.id}
          />
        ))}
      </div>

      {loading && <p className="loading">Loading games...</p>}

      {cursor && !loading && (
        <div className="pagination">
          <button className="btn btn-secondary" onClick={handleLoadMore}>Load More</button>
        </div>
      )}
    </div>
  );
}
