import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getLebron } from '../api';

const VIDEO_ID = 'Y9g1Hj4CAwA';

export default function Home() {
  const [player, setPlayer] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getLebron()
      .then(setPlayer)
      .catch(err => setError(err.message));
  }, []);

  return (
    <div>
      <div className="home-hero">
        <div className="video-bg">
          <iframe
            src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&mute=1&loop=1&playlist=${VIDEO_ID}&controls=0&rel=0&playsinline=1&disablekb=1`}
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
            title="LeBron James highlights"
          />
        </div>
        <div className="video-overlay" />

        <div className="hero-content page">
          <div style={{ flex: 1 }}>
            <h1 className="hero-title">LeBron's Greatest Games</h1>
            <p className="hero-subtitle">
              Browse every game from THE GOAT LeBron Raymone James Sr's legendary NBA career, then build your personal
              catalog of THE GOAT LeBron Raymone James Sr's greatest moments.
            </p>
            <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Link to="/browse">
                <button className="btn btn-primary">Browse Games</button>
              </Link>
              <Link to="/favorites">
                <button className="btn btn-secondary">My Catalog</button>
              </Link>
            </div>
          </div>

          <div className="profile-card">
            <h2 style={{ marginBottom: '0.75rem', fontSize: '1.5rem' }}>The King</h2>
            {error && <p className="error-msg" style={{ fontSize: '0.8rem' }}>{error}</p>}
            {!player && !error && <p className="loading" style={{ padding: '0.5rem 0' }}>Loading...</p>}
            {player && (
              <>
                <div>
                  <span className="label">Full Name</span>
                  <p className="value">{player.first_name} {player.last_name}</p>
                </div>
                <div>
                  <span className="label">Position</span>
                  <p className="value">{player.position || '—'}</p>
                </div>
                <div>
                  <span className="label">Height</span>
                  <p className="value">{player.height || '—'}</p>
                </div>
                <div>
                  <span className="label">Weight</span>
                  <p className="value">{player.weight ? `${player.weight} lbs` : '—'}</p>
                </div>
                <div>
                  <span className="label">Country</span>
                  <p className="value">{player.country || '—'}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
