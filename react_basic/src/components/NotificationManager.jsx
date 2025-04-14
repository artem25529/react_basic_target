import { useContext } from 'react';
import { NotificationContext } from '../pages/PageWrapper.jsx';
import PopupMessage from './PopupMessage.jsx';
import FullscreenPopup from './FullscreenPopup.jsx';

function NotificationManager() {
  const {
    successMsg,
    setSuccessMsg,
    successMsgCallback,
    setSuccessMsgCallback,
    successMsgMillis,
    setSuccessMsgMillis,

    errorMsg,
    setErrorMsg,
    errorMsgCallback,
    setErrorMsgCallback,
    errorMsgMillis,
    setErrorMsgMillis,

    fullscreenPopupContent,
    setFullscreenPopupContent,
  } = useContext(NotificationContext);

  function successPopupResetCallback() {
    setSuccessMsg();
    setSuccessMsgCallback();
    setSuccessMsgMillis();
  }

  function errorPopupResetCallback() {
    setErrorMsg();
    setErrorMsgCallback();
    setErrorMsgMillis();
  }

  return (
    <>
      {successMsg && (
        <PopupMessage
          level="success"
          message={successMsg}
          resetCallback={successPopupResetCallback}
          milliseconds={successMsgMillis}
          callback={successMsgCallback}
        />
      )}

      {errorMsg && (
        <PopupMessage
          level="error"
          message={errorMsg}
          resetCallback={errorPopupResetCallback}
          milliseconds={errorMsgMillis}
          callback={errorMsgCallback}
        />
      )}

      {fullscreenPopupContent && (
        <FullscreenPopup setFullscreenPopupContent={setFullscreenPopupContent}>
          {fullscreenPopupContent}
        </FullscreenPopup>
      )}
    </>
  );
}

export default NotificationManager;
