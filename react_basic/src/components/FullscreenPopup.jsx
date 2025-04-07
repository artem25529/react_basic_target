import { useEffect } from 'react';
import windowUtils from '../services/windowUtils.js';
import '../styles/FullscreenPopup.css';

function FullscreenPopup({ children }) {
  useEffect(() => {
    if (children) {
      windowUtils.toggleWindowScroll(false);
    }

    return () => {
      windowUtils.toggleWindowScroll(true);
    };
  }, [children]);

  return (
    <div className="fullscreen-popup">
      <div className="fullscreen-popup-content">{children}</div>
    </div>
  );
}

export default FullscreenPopup;
