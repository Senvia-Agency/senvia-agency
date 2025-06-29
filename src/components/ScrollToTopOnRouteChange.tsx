
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTopOnRouteChange = () => {
  const location = useLocation();
  const prevLocation = useRef(location.pathname);
  const isFirstMount = useRef(true);

  useEffect(() => {
    // Skip on first mount to avoid unnecessary scroll on page load
    if (isFirstMount.current) {
      isFirstMount.current = false;
      prevLocation.current = location.pathname;
      return;
    }

    // Only scroll if the route actually changed
    if (prevLocation.current !== location.pathname) {
      window.scrollTo(0, 0);
      prevLocation.current = location.pathname;
    }
  }, [location.pathname]);

  return null;
};

export default ScrollToTopOnRouteChange;
