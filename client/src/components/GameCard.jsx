import React from 'react';

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC',
  });
}

export default function GameCard({ game, isSaved, onSave, saving }) {
  const home = game.home_team.full_name;
  const away = game.visitor_team.full_name;
  const hasScore = game.home_team_score > 0 || game.visitor_team_score > 0;

  return (
    <div className="card">
      <span className="card-date">{formatDate(game.date)} &mdash; Season {game.season}–{game.season + 1}</span>
      <div className="card-matchup">{away} @ {home}</div>
      {hasScore && (
        <div className="card-score">
          {game.visitor_team_score} &ndash; {game.home_team_score}
        </div>
      )}
      <div className="card-footer">
        {isSaved
          ? <span className="saved-badge">Saved to My Catalog</span>
          : (
            <button
              className="btn btn-secondary"
              onClick={() => onSave(game)}
              disabled={saving}
            >
              {saving ? 'Saving...' : '+ Save to My Catalog'}
            </button>
          )
        }
      </div>
    </div>
  );
}
