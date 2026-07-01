// A one-shot "where to send the user after they authenticate" pointer.
//
// When a signed-out visitor clicks a gated action (e.g. "Consult now" on the
// public landing page), we stash the intended route here and send them to
// /login. After a successful login OR signup, the auth pages read this back,
// navigate to it, and clear it — so the visitor lands exactly where they meant to.
//
// Two deliberate choices keep this from leaving junk behind or misfiring:
//   - sessionStorage (not localStorage): the whole flow lives in one tab
//     session, so an abandoned entry is wiped automatically when the tab closes.
//   - a short TTL: even within a long-lived tab, a route stashed ages ago must
//     not hijack a later, unrelated login — it simply expires.
const KEY = 'postLoginRedirect';
const TTL_MS = 15 * 60 * 1000; // 15 minutes

interface Pending {
  path: string;
  ts: number;
}

// Only ever redirect to an in-app path ("/patient/..."), never an absolute or
// protocol-relative URL — that would be an open-redirect risk.
function isSafeInternalPath(path: string): boolean {
  return path.startsWith('/') && !path.startsWith('//');
}

// Remember the route to return to once the visitor is authenticated.
export function setPostLoginRedirect(path: string): void {
  if (!isSafeInternalPath(path)) return;
  sessionStorage.setItem(KEY, JSON.stringify({ path, ts: Date.now() } satisfies Pending));
}

// Read the stashed route and clear it in the same call (one-shot). Returns null
// when there's nothing pending, the entry is stale, or it's malformed — so
// callers can safely fall back to the role home.
export function takePostLoginRedirect(): string | null {
  const raw = sessionStorage.getItem(KEY);
  if (!raw) return null;
  sessionStorage.removeItem(KEY);

  try {
    const { path, ts } = JSON.parse(raw) as Pending;
    if (Date.now() - ts > TTL_MS) return null; // expired
    return isSafeInternalPath(path) ? path : null;
  } catch {
    return null; // malformed — ignore rather than crash the redirect
  }
}
