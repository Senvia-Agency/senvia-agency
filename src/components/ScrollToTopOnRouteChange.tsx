
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTopOnRouteChange = () => {
  const location = useLocation();
  const prevLocation = useRef(location.pathname);

  useEffect(() => {
    // Only scroll if the route actually changed
    if (prevLocation.current !== location.pathname) {
      window.scrollTo(0, 0);
      prevLocation.current = location.pathname;
    }
  }, [location.pathname]);

  return null;
};

export default ScrollToTopOnRouteChange;
