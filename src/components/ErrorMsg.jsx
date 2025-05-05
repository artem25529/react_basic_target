import { Link } from 'react-router-dom';
import '../styles/ErrorMsg.css';

function ErrorMsg() {
  return (
    <div className="error-msg">
      <span className="material-symbols-outlined err-icon">error</span>
      <div className="content">
        Sorry, an error occured on our end.
        <br />
      </div>
      <Link to="/">Main Page</Link>
    </div>
  );
}

export default ErrorMsg;
