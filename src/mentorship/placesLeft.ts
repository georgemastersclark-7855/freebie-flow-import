import { useEffect, useState } from 'react';

// Public places count (see get_mentorship_places_left). undefined while loading, null when unavailable.
export function usePlacesLeft(slug: string | undefined): number | null | undefined {
  const [places, setPlaces] = useState<number | null | undefined>(undefined);
  useEffect(() => {
    if (!slug) { setPlaces(null); return; }
    const controller = new AbortController();
    fetch(import.meta.env.VITE_SUPABASE_URL + '/rest/v1/rpc/get_mentorship_places_left', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY },
      body: JSON.stringify({ p_slug: slug }),
      signal: controller.signal,
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((value) => setPlaces(Number.isInteger(value) && value >= 0 ? value : null))
      .catch((error) => { if (error?.name !== 'AbortError') setPlaces(null); });
    return () => controller.abort();
  }, [slug]);
  return places;
}
