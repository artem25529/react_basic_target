import { memo, useEffect, useRef } from 'react';
import '../styles/PopupMessage.css';

function PopupMessage({
  message,
  level,
  callback,
  milliseconds,
  resetCallback,
}) {
  const popupRef = useRef();
  const timeout = useRef();

  useEffect(() => {
    popupRef.current.getAnimations().forEach((anim) => {
      anim.cancel();
      anim.play();
    });

    timeout.current = setTimeout(closeFunc, milliseconds ?? 5000);

    return () => {
      clearTimeout(timeout.current);
    };
  });

  function handleClose() {
    clearTimeout(timeout.current);
    closeFunc();
  }

  function closeFunc() {
    typeof resetCallback === 'function' && resetCallback();
    typeof callback === 'function' && callback();
  }

  return (
    <div
      ref={popupRef}
      className={'popup-message' + (level ? ` ${level}` : '')}
    >
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

function arePropsEqual(oldProps, newProps) {
  return (
    oldProps.message === newProps.message && oldProps.level === newProps.level
  );
}

export default memo(PopupMessage, arePropsEqual);
