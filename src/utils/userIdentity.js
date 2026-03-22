/** Stable id from email so saved data & preferences stay scoped per account (mock auth). */
export function userIdFromEmail(email) {
  const e = (email || '').trim().toLowerCase();
  if (!e) return 'u_guest';
  return `u_${e.replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '') || 'user'}`;
}

/** Display name when the user only signed in with email (no name field on login). */
export function displayNameFromEmail(email) {
  const local = (email || '').split('@')[0] || '';
  const cleaned = local.replace(/[._-]+/g, ' ').replace(/\s+/g, ' ').trim();
  if (!cleaned) return 'Chef';
  return cleaned.replace(/\b\w/g, (c) => c.toUpperCase());
}
