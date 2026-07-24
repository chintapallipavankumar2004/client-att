import { useEffect, useState } from 'react';

function getLocationState() {
  if (typeof window === 'undefined') {
    return {
      pathname: '/',
      search: '',
    };
  }

  return {
    pathname: window.location.pathname,
    search: window.location.search,
  };
}

export function useBrowserLocation() {
  const [location, setLocation] = useState(getLocationState);

  useEffect(() => {
    const handleLocationChange = () => {
      setLocation(getLocationState());
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  return location;
}
