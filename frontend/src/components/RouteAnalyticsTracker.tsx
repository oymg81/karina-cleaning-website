import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../utils/analytics';

/**
 * Listens to client-side React Router navigation transitions and emits GA4 virtual page_view events.
 * Explicitly skips initial mount to prevent duplicate pageviews with GA4's default send_page_view.
 */
export const RouteAnalyticsTracker: React.FC = () => {
  const location = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const currentPath = location.pathname + location.search + location.hash;
    trackPageView(currentPath);
  }, [location.pathname, location.search, location.hash]);

  return null;
};

export default RouteAnalyticsTracker;
