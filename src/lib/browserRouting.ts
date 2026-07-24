export function navigateToPath(path: string, options?: { replace?: boolean }) {
  if (typeof window === 'undefined') {
    return;
  }

  const current = `${window.location.pathname}${window.location.search}`;
  if (current === path) {
    return;
  }

  if (options?.replace) {
    window.history.replaceState({}, '', path);
  } else {
    window.history.pushState({}, '', path);
  }

  window.dispatchEvent(new PopStateEvent('popstate'));
}

export function buildAdminLoginPath(nextPath?: string) {
  if (!nextPath) {
    return '/admin/login';
  }

  return `/admin/login?next=${encodeURIComponent(nextPath)}`;
}
