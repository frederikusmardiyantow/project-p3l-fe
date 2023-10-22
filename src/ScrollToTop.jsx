import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // Bergulir ke puncak jendela saat rute berubah
  }, [pathname]);

  return null; // Anda bisa melewatkan komponen ini, ini tidak menghasilkan output visual
}

export default ScrollToTop;
