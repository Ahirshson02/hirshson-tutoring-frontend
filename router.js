import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

// '/your-repo-name' if the site is at username.github.io/your-repo-name
// '' if you use a user site (username.github.io) or a custom domain
export const BASE = "";

function currentPath() {
  if (Platform.OS !== 'web') return '/';
  let p = window.location.pathname;
  if (BASE && p.startsWith(BASE)) p = p.slice(BASE.length);
  return p.replace(/\/+$/, '') || '/';
}

export function navigate(path) {
  window.history.pushState({}, '', BASE + path);
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo(0, 0);
}

export function usePath() {
  const [path, setPath] = useState(currentPath());
  useEffect(() => {
    const onChange = () => setPath(currentPath());
    window.addEventListener('popstate', onChange);
    return () => window.removeEventListener('popstate', onChange);
  }, []);
  return path;
}

// Props for a link that works as a real <a> on web (right-click, open in new tab)
export function linkProps(path) {
  return {
    accessibilityRole: 'link',
    href: BASE + path,
    onPress: (e) => {
      e?.preventDefault?.();
      navigate(path);
    },
  };
}