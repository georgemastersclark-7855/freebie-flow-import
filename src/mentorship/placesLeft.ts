import { useEffect, useState } from 'react';

const fetchPublic = (name: string, slug: string, signal: AbortSignal) =>
  fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/rpc/${name}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY },
    body: JSON.stringify({ p_slug: slug }),
    signal,
  }).then((response) => (response.ok ? response.json() : null));

// Public places count (see get_mentorship_places_left). undefined while loading, null when unavailable.
export function usePlacesLeft(slug: string | undefined): number | null | undefined {
  const [places, setPlaces] = useState<number | null | undefined>(undefined);
  useEffect(() => {
    if (!slug) { setPlaces(null); return; }
    const controller = new AbortController();
    fetchPublic('get_mentorship_places_left', slug, controller.signal)
      .then((value) => setPlaces(Number.isInteger(value) && value >= 0 ? value : null))
      .catch((error) => { if (error?.name !== 'AbortError') setPlaces(null); });
    return () => controller.abort();
  }, [slug]);
  return places;
}

// When the places were last updated (see get_mentorship_places_updated_at). null until staff first press Update places.
export function usePlacesUpdatedAt(slug: string): string | null {
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    fetchPublic('get_mentorship_places_updated_at', slug, controller.signal)
      .then((value) => setUpdatedAt(typeof value === 'string' ? value : null))
      .catch(() => setUpdatedAt(null));
    return () => controller.abort();
  }, [slug]);
  return updatedAt;
}
