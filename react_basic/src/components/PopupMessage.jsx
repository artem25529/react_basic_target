import { useEffect, useRef } from 'react';
import '../styles/PopupMessage.css';

function PopupMessage({
  message,
  level,
  resetCallback,
  callback,
  milliseconds,
}) {
  const timeout = useRef();

  useEffect(() => {
    timeout.current = setTimeout(
      () => {
        closeFunc();
      },
      milliseconds ? milliseconds : 5000,
    );
  }, []);

  function handleClose() {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }

    closeFunc();
  }

  function closeFunc() {
    if (typeof resetCallback === 'function') {
      resetCallback();
    }

    if (typeof callback === 'function') {
      callback();
    }
  }

  return (
    <div className={'popup-message' + (level ? ` ${level}` : '')}>
      <div className="popup-content">{message}</div>
      <button
        type="button"
        className="material-symbols-outlined popup-close"
        onClick={handleClose}
      >
        cancel
      </button>
    </div>
  );
}

export default PopupMessage;
