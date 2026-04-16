// JioSaavn API service for SANGEET
// Uses an open JioSaavn API wrapper for search, streaming, and metadata

const API_BASE = 'https://jiosaavn-api-privatecvc2.vercel.app';

/**
 * Normalize a JioSaavn song result into SANGEET's internal format
 */
function normalizeSong(song) {
  // Get the highest quality image (500x500)
  const cover = song.image?.find(img => img.quality === '500x500')?.link
    || song.image?.[song.image.length - 1]?.link
    || '';

  // Get the highest quality audio URL (320kbps)
  const audioUrl = song.downloadUrl?.find(u => u.quality === '320kbps')?.link
    || song.downloadUrl?.find(u => u.quality === '160kbps')?.link
    || song.downloadUrl?.[song.downloadUrl.length - 1]?.link
    || '';

  return {
    id: song.id,
    title: cleanHtmlEntities(song.name || ''),
    artist: cleanHtmlEntities(song.primaryArtists || song.featuredArtists || 'Unknown'),
    album: cleanHtmlEntities(song.album?.name || ''),
    cover_url: cover,
    audio_url: audioUrl,
    duration: parseInt(song.duration, 10) || 0,
    year: song.year || '',
    language: song.language || '',
    play_count: parseInt(song.playCount, 10) || 0,
    has_lyrics: song.hasLyrics === 'true',
    source: 'jiosaavn',
  };
}

/**
 * Clean HTML entities from song names (e.g., &amp; &quot;)
 */
function cleanHtmlEntities(str) {
  if (!str) return '';
  const textarea = document.createElement('textarea');
  textarea.innerHTML = str;
  return textarea.value;
}

/**
 * Search songs by query
 * @param {string} query - Search term
 * @param {number} limit - Max results (default 20)
 * @returns {Promise<Array>} Normalized song array
 */
export async function searchSongs(query, limit = 20) {
  if (!query.trim()) return [];

  try {
    const res = await fetch(
      `${API_BASE}/search/songs?query=${encodeURIComponent(query)}&limit=${limit}`
    );
    const data = await res.json();

    if (data.status === 'SUCCESS' && data.data?.results) {
      return data.data.results.map(normalizeSong);
    }
    return [];
  } catch (err) {
    console.error('[MusicAPI] Search failed:', err);
    return [];
  }
}

/**
 * Get song details by ID
 * @param {string} id - JioSaavn song ID
 * @returns {Promise<Object|null>}
 */
export async function getSongById(id) {
  try {
    const res = await fetch(`${API_BASE}/songs?id=${id}`);
    const data = await res.json();

    if (data.status === 'SUCCESS' && data.data?.[0]) {
      return normalizeSong(data.data[0]);
    }
    return null;
  } catch (err) {
    console.error('[MusicAPI] Song fetch failed:', err);
    return null;
  }
}

/**
 * Get trending / popular songs
 * @param {string} language - Language filter (hindi, english, etc.)
 * @returns {Promise<Array>}
 */
export async function getTrendingSongs(language = 'hindi') {
  try {
    // Search for popular/trending terms
    const queries = ['trending', 'top hits', 'new releases'];
    const randomQuery = queries[Math.floor(Math.random() * queries.length)];
    const res = await fetch(
      `${API_BASE}/search/songs?query=${encodeURIComponent(randomQuery)}&limit=20`
    );
    const data = await res.json();

    if (data.status === 'SUCCESS' && data.data?.results) {
      return data.data.results.map(normalizeSong);
    }
    return [];
  } catch (err) {
    console.error('[MusicAPI] Trending fetch failed:', err);
    return [];
  }
}

/**
 * Get song suggestions / recommendations based on a song ID
 * @param {string} id - JioSaavn song ID
 * @returns {Promise<Array>}
 */
export async function getSongSuggestions(id) {
  try {
    const res = await fetch(`${API_BASE}/songs/${id}/suggestions?limit=10`);
    const data = await res.json();

    if (data.status === 'SUCCESS' && data.data) {
      return data.data.map(normalizeSong);
    }
    return [];
  } catch (err) {
    console.error('[MusicAPI] Suggestions fetch failed:', err);
    return [];
  }
}

/**
 * Get lyrics for a song
 * @param {string} id - JioSaavn song ID
 * @returns {Promise<Object|null>} { lyrics, snippet, copyright }
 */
export async function getLyrics(id) {
  try {
    const res = await fetch(`${API_BASE}/lyrics?id=${id}`);
    const data = await res.json();

    if (data.status === 'SUCCESS' && data.data?.lyrics) {
      // Split lyrics into lines for display
      const raw = data.data.lyrics;
      const lines = raw
        .split(/(?:\s{2,}|\n)/)
        .map(l => l.trim())
        .filter(Boolean);
      return {
        lines,
        snippet: data.data.snippet || '',
        copyright: data.data.copyright || '',
      };
    }
    return null;
  } catch (err) {
    console.error('[MusicAPI] Lyrics fetch failed:', err);
    return null;
  }
}

/**
 * Download a song (returns the highest quality direct URL)
 * @param {Object} song - SANGEET normalized song object
 * @returns {string} Direct download URL
 */
export function getDownloadUrl(song) {
  return song.audio_url || '';
}
