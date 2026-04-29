import React, { useState } from 'react';
import { updateFavorite } from '../api';

export default function NotesForm({ favorite, onUpdated }) {
  const [notes, setNotes] = useState(favorite.notes || '');
  const [tags, setTags] = useState((favorite.tags || []).join(', '));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const updated = await updateFavorite(favorite._id, { notes, tags });
      onUpdated(updated);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="notes-form" onSubmit={handleSubmit}>
      {error && <p className="error-msg">{error}</p>}
      <label htmlFor={`notes-${favorite._id}`}>Notes</label>
      <textarea
        id={`notes-${favorite._id}`}
        value={notes}
        onChange={e => setNotes(e.target.value)}
        maxLength={500}
        placeholder="Why is this game memorable?"
      />
      <label htmlFor={`tags-${favorite._id}`}>Tags (comma-separated)</label>
      <input
        id={`tags-${favorite._id}`}
        type="text"
        value={tags}
        onChange={e => setTags(e.target.value)}
        placeholder="buzzer beater, playoffs, 40+ points"
      />
      <button type="submit" className="btn btn-secondary" disabled={saving} style={{ marginTop: '0.5rem' }}>
        {saving ? 'Saving...' : 'Save Notes'}
      </button>
    </form>
  );
}
