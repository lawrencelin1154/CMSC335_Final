import React, { useEffect, useState } from 'react';
import { getTeams } from '../api';

const LEBRON_TEAM_IDS = new Set([6, 16, 14]);
const LEBRON_START_SEASON = 2003;

function buildSeasons() {
  const currentYear = new Date().getFullYear();
  const currentSeason = new Date().getMonth() >= 9 ? currentYear : currentYear - 1;
  const seasons = [];
  for (let s = currentSeason; s >= LEBRON_START_SEASON; s--) seasons.push(s);
  return seasons;
}

export default function FilterForm({ onFilter, loading }) {
  const [teams, setTeams] = useState([]);
  const [season, setSeason] = useState(2024);
  const [teamId, setTeamId] = useState(14);
  const seasons = buildSeasons();

  useEffect(() => {
    getTeams()
      .then(all => setTeams(all.filter(t => LEBRON_TEAM_IDS.has(t.id))))
      .catch(() => {});
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    onFilter({ season, team_ids: teamId });
  }

  return (
    <form className="filter-form" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="season">Season</label>
        <select id="season" value={season} onChange={e => setSeason(Number(e.target.value))}>
          {seasons.map(s => (
            <option key={s} value={s}>{s}–{s + 1}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="team">Team</label>
        <select id="team" value={teamId} onChange={e => setTeamId(Number(e.target.value))}>
          {teams.map(t => (
            <option key={t.id} value={t.id}>{t.full_name}</option>
          ))}
          {teams.length === 0 && <option value={14}>Los Angeles Lakers</option>}
        </select>
      </div>
      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? 'Loading...' : 'Browse Games'}
      </button>
    </form>
  );
}
